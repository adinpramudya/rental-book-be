import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateInitialSchema1725166292323 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TYPE book_status_enum AS ENUM ('AVAILABLE', 'BORROWED', 'REPAIR', 'LOST', 'UNAVAILABLE', 'QUARANTINE');
    `);
    await queryRunner.query(`
      CREATE TABLE "category" (
        "id" SERIAL NOT NULL PRIMARY KEY,
        "name" VARCHAR NOT NULL,
        "description" VARCHAR NOT NULL,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        "isActive" BOOLEAN NOT NULL DEFAULT false,
        "createdBy" VARCHAR NOT NULL,
        "updatedBy" VARCHAR NOT NULL
      );
    `);

    await queryRunner.query(`
      CREATE TABLE "publisher" (
        "id" SERIAL NOT NULL PRIMARY KEY,
        "name" VARCHAR NOT NULL,
        "address" VARCHAR NOT NULL,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        "isActive" BOOLEAN NOT NULL DEFAULT false,
        "createdBy" VARCHAR NOT NULL,
        "updatedBy" VARCHAR NOT NULL
      );
    `);

    await queryRunner.query(`
      CREATE TABLE "book" (
        "id" SERIAL NOT NULL PRIMARY KEY,
        "title" VARCHAR NOT NULL,
        "author" VARCHAR NOT NULL,
        "isbn" VARCHAR NOT NULL,
        "isbn13" VARCHAR NOT NULL,
        "stock" INTEGER NOT NULL,
        "publicationDate" TIMESTAMP NOT NULL,
        "countPage" INTEGER NOT NULL,
        "language" VARCHAR NOT NULL,
        "description" TEXT NOT NULL,
        "coverBook" VARCHAR NOT NULL,
        "state" "book_status_enum" NOT NULL DEFAULT 'AVAILABLE',
        "categoryId" INTEGER,
        "publisherId" INTEGER,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        "isActive" BOOLEAN NOT NULL DEFAULT false,
        "createdBy" VARCHAR NOT NULL,
        "updatedBy" VARCHAR NOT NULL,
        FOREIGN KEY ("categoryId") REFERENCES "category"("id"),
        FOREIGN KEY ("publisherId") REFERENCES "publisher"("id")
      );
    `);

    await queryRunner.query(`
      CREATE TABLE "member" (
        "id" UUID NOT NULL PRIMARY KEY DEFAULT uuid_generate_v4(),
        "name" VARCHAR NOT NULL,
        "email" VARCHAR NOT NULL UNIQUE,
        "alamat" VARCHAR NOT NULL,
        "phoneNumber" VARCHAR NOT NULL,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        "isActive" BOOLEAN NOT NULL DEFAULT false,
        "createdBy" VARCHAR NOT NULL,
        "updatedBy" VARCHAR NOT NULL,
        "profilePhoto" VARCHAR
      );
    `);

    await queryRunner.query(`
      CREATE TABLE "role" (
        "id" SERIAL NOT NULL PRIMARY KEY,
        "name" VARCHAR NOT NULL,
        "code" VARCHAR NOT NULL UNIQUE,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        "createdBy" VARCHAR NOT NULL,
        "updatedBy" VARCHAR NOT NULL
      );
    `);

    await queryRunner.query(`
      CREATE TABLE "user" (
        "id" UUID NOT NULL PRIMARY KEY DEFAULT uuid_generate_v4(),
        "name" VARCHAR NOT NULL,
        "email" VARCHAR NOT NULL UNIQUE,
        "password" VARCHAR NOT NULL,
        "username" VARCHAR NOT NULL,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        "isActive" BOOLEAN NOT NULL DEFAULT false,
        "createdBy" VARCHAR NOT NULL,
        "updatedBy" VARCHAR NOT NULL,
        "roleId" INTEGER,
        FOREIGN KEY ("roleId") REFERENCES "role"("id")
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DROP TYPE book_status_enum;
    `);
    await queryRunner.query(`DROP TABLE "user"`);
    await queryRunner.query(`DROP TABLE "role"`);
    await queryRunner.query(`DROP TABLE "member"`);
    await queryRunner.query(`DROP TABLE "book"`);
    await queryRunner.query(`DROP TABLE "publisher"`);
    await queryRunner.query(`DROP TABLE "category"`);
  }
}
