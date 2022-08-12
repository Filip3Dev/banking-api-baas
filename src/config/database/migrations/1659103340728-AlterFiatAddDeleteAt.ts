import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm'

export class AlterFiatAddDeleteAt1659102232143 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumns('fiats', [
      new TableColumn({
        name: 'deleted_at',
        type: 'timestamp',
        isNullable: true,
      }),
    ])
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumns('fiats', ['deleted_at'])
  }
}
