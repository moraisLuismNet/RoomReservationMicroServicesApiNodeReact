import { MigrationInterface, QueryRunner } from "typeorm";

export class DropEmailLogTable1766834727540 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "email_logs"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "email_logs" ("id" SERIAL NOT NULL, "to" character varying NOT NULL, "subject" character varying NOT NULL, "body" text NOT NULL, "status" character varying NOT NULL DEFAULT 'sent', "sentAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_999382218924e953a790d340571" PRIMARY KEY ("id"))`
    );
  }
}
