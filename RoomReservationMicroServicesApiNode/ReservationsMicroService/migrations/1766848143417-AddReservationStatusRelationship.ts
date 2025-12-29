import { MigrationInterface, QueryRunner } from "typeorm";

export class AddReservationStatusRelationship1766848143417 implements MigrationInterface {
    name = 'AddReservationStatusRelationship1766848143417'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "reservations" RENAME COLUMN "status" TO "status_id"`);
        await queryRunner.query(`ALTER TYPE "public"."reservations_status_enum" RENAME TO "reservations_status_id_enum"`);
        await queryRunner.query(`ALTER TABLE "reservations" DROP COLUMN "status_id"`);
        await queryRunner.query(`ALTER TABLE "reservations" ADD "status_id" integer NOT NULL DEFAULT '1'`);
        await queryRunner.query(`ALTER TABLE "reservations" ADD CONSTRAINT "FK_11b07d4d4900ef6ca2f9db171a9" FOREIGN KEY ("status_id") REFERENCES "reservation_statuses"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "reservations" DROP CONSTRAINT "FK_11b07d4d4900ef6ca2f9db171a9"`);
        await queryRunner.query(`ALTER TABLE "reservations" DROP COLUMN "status_id"`);
        await queryRunner.query(`ALTER TABLE "reservations" ADD "status_id" "public"."reservations_status_id_enum" NOT NULL DEFAULT 'pending'`);
        await queryRunner.query(`ALTER TYPE "public"."reservations_status_id_enum" RENAME TO "reservations_status_enum"`);
        await queryRunner.query(`ALTER TABLE "reservations" RENAME COLUMN "status_id" TO "status"`);
    }

}
