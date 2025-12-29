import { Request, Response } from "express";
import { EmailService } from "../services/email.service";
import { validate } from "class-validator";
import { plainToInstance } from "class-transformer";
import { SendEmailDto } from "../dtos/email.dto";
import logger from "../utils/logger";

const emailService = new EmailService();

export class EmailController {
  async sendEmail(req: Request, res: Response) {
    try {
      const dto = plainToInstance(SendEmailDto, req.body);
      const errors = await validate(dto);
      if (errors.length > 0) {
        return res.status(400).json({ errors });
      }

      const { to, subject, body } = req.body;
      logger.info(`Incoming email request to: ${to}, subject: ${subject}`);
      await emailService.sendEmail(to, subject, body);
      res.status(200).json({ message: "Email sent successfully" });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }
}
