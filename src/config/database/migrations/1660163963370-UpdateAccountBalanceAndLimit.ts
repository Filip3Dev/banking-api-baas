import { MigrationInterface, QueryRunner } from 'typeorm'

export class UpdateAccountBalanceAndLimit1660163963370 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE accounts ALTER COLUMN "limit" TYPE decimal(10, 2)`)
    await queryRunner.query(`ALTER TABLE accounts ALTER COLUMN balance TYPE decimal(10, 2)`)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE accounts ALTER COLUMN "limit" TYPE decimal(30, 7)`)
    await queryRunner.query(`ALTER TABLE accounts ALTER COLUMN balance TYPE decimal(30, 7)`)
  }
}
