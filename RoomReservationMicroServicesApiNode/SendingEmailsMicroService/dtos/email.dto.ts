import { IsNotEmpty, IsEmail, IsString } from "class-validator";

export class SendEmailDto {
  @IsNotEmpty()
  @IsEmail()
  to!: string;

  @IsNotEmpty()
  @IsString()
  subject!: string;

  @IsNotEmpty()
  @IsString()
  body!: string;
}

export interface EmailQueueDTO {
  emailQueueId: number;
  toEmail: string;
  subject: string;
  status: string;
  attempts: number;
  scheduledSendTime: Date;
  sentAt?: Date;
  errorMessage?: string;
  createdAt: Date;
}

export interface CreateEmailQueueDTO {
  toEmail: string;
  subject: string;
  body: string;
  emailType: string;
}

export interface UpdateEmailQueueDTO {
  status: string;
  scheduledSendTime: Date;
}
