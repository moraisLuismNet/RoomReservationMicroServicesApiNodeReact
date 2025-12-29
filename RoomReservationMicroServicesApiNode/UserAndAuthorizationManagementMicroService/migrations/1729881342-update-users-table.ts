import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateUsersTable1729881342 implements MigrationInterface {
  name = "UpdateUsersTable1729881342";

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Agregar la columna name temporalmente
    await queryRunner.query(
      `ALTER TABLE "users" ADD "name" character varying NOT NULL DEFAULT ''`
    );

    // Combinar firstName y lastName en name
    await queryRunner.query(
      `UPDATE "users" SET "name" = CONCAT("firstName", ' ', "lastName") WHERE "firstName" IS NOT NULL OR "lastName" IS NOT NULL`
    );

    // Eliminar las columnas firstName y lastName
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "firstName"`);
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "lastName"`);

    // Hacer email la clave primaria
    await queryRunner.query(
      `ALTER TABLE "users" DROP CONSTRAINT IF EXISTS "users_pkey"`
    );
    await queryRunner.query(
      `ALTER TABLE "users" ADD CONSTRAINT "users_pkey" PRIMARY KEY ("email")`
    );

    // Eliminar la columna id
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "id"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Revertir los cambios
    // Agregar las columnas eliminadas
    await queryRunner.query(`ALTER TABLE "users" ADD "id" SERIAL NOT NULL`);
    await queryRunner.query(
      `ALTER TABLE "users" ADD "firstName" character varying NOT NULL`
    );
    await queryRunner.query(
      `ALTER TABLE "users" ADD "lastName" character varying NOT NULL`
    );

    // Hacer id la clave primaria de nuevo
    await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "users_pkey"`);
    await queryRunner.query(
      `ALTER TABLE "users" ADD CONSTRAINT "users_pkey" PRIMARY KEY ("id")`
    );

    // Hacer email único de nuevo
    await queryRunner.query(
      `ALTER TABLE "users" ADD CONSTRAINT "users_email_unique" UNIQUE ("email")`
    );

    // Eliminar la columna name
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "name"`);
  }
}
