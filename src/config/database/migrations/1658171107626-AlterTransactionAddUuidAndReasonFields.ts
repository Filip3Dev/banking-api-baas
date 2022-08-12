import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm'

export class AlterTransactionAddUuidAndReasonFields1658171107626 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumns('transactions', [
      new TableColumn({
        name: 'uuid',
        type: 'varchar',
        generationStrategy: 'uuid',
        default: 'uuid_generate_v4()',
      }),
      new TableColumn({
        name: 'reason',
        type: 'varchar',
        isNullable: true,
      }),
    ])
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumns('transactions', ['uuid', 'reason'])
  }
}
