import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateRoomStructure1735246000000 implements MigrationInterface {
  name = "UpdateRoomStructure1735246000000";

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create room_types table
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "room_types" (
        "id" SERIAL PRIMARY KEY,
        "name" VARCHAR NOT NULL UNIQUE,
        "description" TEXT,
        "pricePerNight" DECIMAL NOT NULL,
        "capacity" INTEGER NOT NULL,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now()
      )
    `);

    // Drop old rooms table if exists and create new structure
    await queryRunner.query(`DROP TABLE IF EXISTS "rooms" CASCADE`);

    await queryRunner.query(`
      CREATE TABLE "rooms" (
        "roomId" SERIAL PRIMARY KEY,
        "room_number" VARCHAR(10) NOT NULL UNIQUE,
        "room_type_id" INTEGER NOT NULL,
        "is_active" BOOLEAN NOT NULL DEFAULT true,
        "image_room" VARCHAR(2048),
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "FK_room_type" FOREIGN KEY ("room_type_id") 
          REFERENCES "room_types"("id") ON DELETE RESTRICT ON UPDATE CASCADE
      )
    `);

    // Create indexes
    await queryRunner.query(`
      CREATE INDEX "IDX_room_type_id" ON "rooms" ("room_type_id")
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_room_is_active" ON "rooms" ("is_active")
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop new structure
    await queryRunner.query(`DROP TABLE IF EXISTS "rooms" CASCADE`);
    await queryRunner.query(`DROP TABLE IF EXISTS "room_types" CASCADE`);

    // Recreate old structure
    await queryRunner.query(`
      CREATE TABLE "rooms" (
        "id" SERIAL PRIMARY KEY,
        "name" VARCHAR NOT NULL,
        "description" VARCHAR NOT NULL,
        "pricePerNight" DECIMAL NOT NULL,
        "capacity" INTEGER NOT NULL,
        "imageUrl" VARCHAR NOT NULL,
        "isAvailable" BOOLEAN NOT NULL DEFAULT true,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now()
      )
    `);
  }
}
