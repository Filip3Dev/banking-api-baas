import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm'

export class AlterTransactionsAddDeleteAt1659102232143 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumns('transactions', [
      new TableColumn({
        name: 'deleted_at',
        type: 'timestamp',
        isNullable: true,
      }),
    ])
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumns('transactions', ['deleted_at'])
  }
}
