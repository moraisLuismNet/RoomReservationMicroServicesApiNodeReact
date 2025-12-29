import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialMigration1766786179979 implements MigrationInterface {
    name = 'InitialMigration1766786179979'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."reservations_status_enum" AS ENUM('pending', 'confirmed', 'cancelled', 'paid')`);
        await queryRunner.query(`CREATE TABLE "reservations" ("id" SERIAL NOT NULL, "roomId" integer NOT NULL, "userId" integer NOT NULL, "checkInDate" TIMESTAMP NOT NULL, "checkOutDate" TIMESTAMP NOT NULL, "totalPrice" numeric NOT NULL, "status" "public"."reservations_status_enum" NOT NULL DEFAULT 'pending', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_da95cef71b617ac35dc5bcda243" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."reservation_statuses_name_enum" AS ENUM('pending', 'confirmed', 'checked_in', 'checked_out', 'cancelled', 'no_show', 'completed', 'paid')`);
        await queryRunner.query(`CREATE TABLE "reservation_statuses" ("id" SERIAL NOT NULL, "name" "public"."reservation_statuses_name_enum" NOT NULL, "description" text, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_928a7beb4ffbdae133933b28f7c" UNIQUE ("name"), CONSTRAINT "PK_3419b68921db15fcaf470421297" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "reservation_statuses"`);
        await queryRunner.query(`DROP TYPE "public"."reservation_statuses_name_enum"`);
        await queryRunner.query(`DROP TABLE "reservations"`);
        await queryRunner.query(`DROP TYPE "public"."reservations_status_enum"`);
    }

}
