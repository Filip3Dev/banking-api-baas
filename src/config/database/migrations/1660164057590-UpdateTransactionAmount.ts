import { MigrationInterface, QueryRunner } from 'typeorm'

export class UpdateTransactionAmount1660164057590 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE transactions ALTER COLUMN amount TYPE decimal(10, 2)`)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE transactions ALTER COLUMN amount TYPE decimal(30, 7)`)
  }
}
