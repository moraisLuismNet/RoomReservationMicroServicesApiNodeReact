import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from "typeorm";

@Entity()
export class EmailQueue {
  @PrimaryGeneratedColumn()
  emailQueueId!: number;

  @Column()
  toEmail!: string;

  @Column()
  subject!: string;

  @Column("text")
  body!: string;

  @Column()
  emailType!: string;

  @Column()
  status!: string;

  @Column({ default: 0 })
  attempts!: number;

  @Column()
  scheduledSendTime!: Date;

  @Column({ nullable: true })
  sentAt?: Date;

  @Column({ nullable: true })
  errorMessage?: string;

  @CreateDateColumn()
  createdAt!: Date;
}
