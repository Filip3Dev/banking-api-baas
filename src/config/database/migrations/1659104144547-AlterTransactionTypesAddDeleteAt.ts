import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm'

export class AlterTransactionTypesAddDeleteAt1659102232143 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumns('transaction_types', [
      new TableColumn({
        name: 'deleted_at',
        type: 'timestamp',
        isNullable: true,
      }),
    ])
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumns('transaction_types', ['deleted_at'])
  }
}
