/**
 * Description: users table table migration
 */

import { MigrationInterface, QueryRunner } from 'typeorm';

export class usersTable1601618593391 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TABLE "users" (
          "id" SERIAL PRIMARY KEY,
          "name" TEXT NOT NULL,
          "password" VARCHAR(255) NOT NULL,
          "role" SMALLINT NOT NULL DEFAULT 1,
          "rating" DECIMAL NOT NULL DEFAULT 1.0,
          "created_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
          "updated_at" TIMESTAMPTZ NOT NULL DEFAULT NOW()
        );`);
    await queryRunner.query(`INSERT INTO "users"
        (name, password, role, rating)
        VALUES('Admin', 'Qwe123!', 1, '10.0');`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "users";`);
  }
}
