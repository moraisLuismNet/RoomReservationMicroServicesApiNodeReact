import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialMigration1766786188578 implements MigrationInterface {
    name = 'InitialMigration1766786188578'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "email_logs" ("id" SERIAL NOT NULL, "to" character varying NOT NULL, "subject" character varying NOT NULL, "body" text NOT NULL, "status" character varying NOT NULL DEFAULT 'sent', "sentAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_999382218924e953a790d340571" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "email_logs"`);
    }

}
