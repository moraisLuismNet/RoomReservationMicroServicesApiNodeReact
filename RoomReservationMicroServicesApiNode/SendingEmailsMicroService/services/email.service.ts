import * as dotenv from "dotenv";
import { AppDataSource } from "../config/database";
import { EmailQueue } from "../models/EmailQueue";
import logger from "../utils/logger";

// Load environment variables
dotenv.config();

export class EmailService {
  private emailQueueRepository = AppDataSource.getRepository(EmailQueue);

  async sendEmail(to: string, subject: string, body: string) {
    const brevoApiKey = process.env.BREVO_API_KEY;
    const senderEmail = process.env.EMAIL_FROM_EMAIL;
    const senderName = process.env.EMAIL_FROM_NAME;

    if (!brevoApiKey || !senderEmail || !senderName) {
      const errorMsg =
        "Brevo configuration is missing (API Key, sender email, or sender name)";
      logger.error(errorMsg);
      throw new Error(errorMsg);
    }

    try {
      const payload = {
        sender: {
          email: senderEmail,
          name: senderName,
        },
        to: [{ email: to }],
        subject: subject,
        htmlContent: body,
      };

      const response = await fetch("https://api.brevo.com/v3/smtp/email", {
        method: "POST",
        headers: {
          "api-key": brevoApiKey,
          accept: "application/json",
          "content-type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorText = await response.text();
        logger.error(
          `Brevo API call failed: ${response.status} - ${errorText}`
        );
        throw new Error(`Brevo API error: ${response.status} - ${errorText}`);
      }

      logger.info(`Brevo API call successful for ${to}`);

      const log = this.emailQueueRepository.create({
        toEmail: to,
        subject,
        body,
        status: "sent",
        emailType: "direct",
        scheduledSendTime: new Date(),
        sentAt: new Date(),
        attempts: 1,
      });
      await this.emailQueueRepository.save(log);

      logger.info(`Email sent via API to ${to}: ${subject}`);
    } catch (error: any) {
      logger.error(`Error sending email via API to ${to}: ${error.message}`);
      const log = this.emailQueueRepository.create({
        toEmail: to,
        subject,
        body,
        status: "failed",
        emailType: "direct",
        scheduledSendTime: new Date(),
        attempts: 1,
        errorMessage: error.message,
      });
      await this.emailQueueRepository.save(log);
      throw error;
    }
  }
}
