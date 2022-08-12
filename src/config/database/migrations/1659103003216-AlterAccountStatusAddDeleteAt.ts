import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm'

export class AlterAccountStatusAddDeleteAt1659102232143 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumns('account_status', [
      new TableColumn({
        name: 'deleted_at',
        type: 'timestamp',
        isNullable: true,
      }),
    ])
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumns('account_status', ['deleted_at'])
  }
}
