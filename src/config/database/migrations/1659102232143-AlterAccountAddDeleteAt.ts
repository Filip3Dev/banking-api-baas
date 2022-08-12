import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm'

export class AlterAccountAddDeleteAt1659102232143 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumns('accounts', [
      new TableColumn({
        name: 'deleted_at',
        type: 'timestamp',
        isNullable: true,
      }),
    ])
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumns('accounts', ['deleted_at'])
  }
}
