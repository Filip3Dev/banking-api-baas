import { MigrationInterface, QueryRunner, Table } from 'typeorm'

export class CreateAccount1656437428457 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'accounts',
        columns: [
          {
            name: 'id',
            type: 'integer',
            isGenerated: true,
            generationStrategy: 'increment',
            isPrimary: true,
          },
          {
            name: 'external_user_id',
            type: 'varchar',
          },
          {
            name: 'limit',
            type: 'decimal(30, 7)',
          },
          {
            name: 'balance',
            type: 'decimal(30, 7)',
          },
          {
            name: 'segmentation_id',
            type: 'integer',
          },
          {
            name: 'fiat_id',
            type: 'integer',
          },
          {
            name: 'status_id',
            type: 'integer',
          },
          {
            name: 'is_blocked',
            type: 'boolean',
            default: false,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'now()',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'now()',
          },
        ],
        foreignKeys: [
          {
            name: 'FK_AccountSegmentations',
            referencedTableName: 'account_segmentations',
            referencedColumnNames: ['id'],
            columnNames: ['segmentation_id'],
            onDelete: 'RESTRICT',
            onUpdate: 'RESTRICT',
          },
          {
            name: 'FK_AccountFiat',
            referencedTableName: 'fiats',
            referencedColumnNames: ['id'],
            columnNames: ['fiat_id'],
            onDelete: 'RESTRICT',
            onUpdate: 'RESTRICT',
          },
          {
            name: 'FK_AccountStatus',
            referencedTableName: 'account_status',
            referencedColumnNames: ['id'],
            columnNames: ['status_id'],
            onDelete: 'RESTRICT',
            onUpdate: 'RESTRICT',
          },
        ],
      })
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('accounts')
  }
}
