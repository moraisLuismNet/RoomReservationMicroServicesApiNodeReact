import { AppDataSource } from "../config/database";
import { EmailQueue } from "../models/EmailQueue";
import {
  EmailQueueDTO,
  CreateEmailQueueDTO,
  UpdateEmailQueueDTO,
} from "../dtos/email.dto";

export class EmailQueueService {
  private repository = AppDataSource.getRepository(EmailQueue);

  async getAllEmailQueues(): Promise<EmailQueueDTO[]> {
    const items = await this.repository.find();
    return items.map((i) => this.mapToDTO(i));
  }

  async getEmailQueue(emailQueueId: number): Promise<EmailQueueDTO | null> {
    const item = await this.repository.findOneBy({ emailQueueId });
    return item ? this.mapToDTO(item) : null;
  }

  async postEmailQueue(dto: CreateEmailQueueDTO): Promise<EmailQueueDTO> {
    const item = new EmailQueue();
    item.toEmail = dto.toEmail;
    item.subject = dto.subject;
    item.body = dto.body;
    item.emailType = dto.emailType;
    item.scheduledSendTime = new Date();
    item.status = "pending";

    const saved = await this.repository.save(item);
    return this.mapToDTO(saved);
  }

  async putEmailQueue(
    emailQueueId: number,
    dto: UpdateEmailQueueDTO
  ): Promise<boolean> {
    const item = await this.repository.findOneBy({ emailQueueId });
    if (!item) return false;

    item.status = dto.status;
    item.scheduledSendTime = dto.scheduledSendTime;

    await this.repository.save(item);
    return true;
  }

  async deleteEmailQueue(emailQueueId: number): Promise<boolean> {
    const result = await this.repository.delete(emailQueueId);
    return result.affected !== 0;
  }

  private mapToDTO(i: EmailQueue): EmailQueueDTO {
    return {
      emailQueueId: i.emailQueueId,
      toEmail: i.toEmail,
      subject: i.subject,
      status: i.status,
      attempts: i.attempts,
      scheduledSendTime: i.scheduledSendTime,
      sentAt: i.sentAt,
      errorMessage: i.errorMessage,
      createdAt: i.createdAt,
    };
  }
}
