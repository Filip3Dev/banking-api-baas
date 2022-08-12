import { MigrationInterface, QueryRunner } from 'typeorm'

export class AlterTransactionTypes1658517756741 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `UPDATE transaction_types SET slug='REVERT_CASH_OUT',
                name_extract='REVERT_CASH_OUT', 
                description='REVERT_CASH_OUT',
                operation_type='CREDIT'
                WHERE slug='REVERT_SELL'`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `UPDATE transaction_types SET slug='REVERT_SELL',
                name_extract='REVERT_SELL', 
                description='REVERT_SELL',
                operation_type='DEBIT'
                WHERE slug='REVERT_CASH_OUT'`
    )
  }
}
