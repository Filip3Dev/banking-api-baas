import { MigrationInterface, QueryRunner, Table } from 'typeorm'

export class CreateTransaction1656440925006 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'transactions',
        columns: [
          {
            name: 'id',
            type: 'integer',
            isGenerated: true,
            generationStrategy: 'increment',
            isPrimary: true,
          },
          {
            name: 'account_id',
            type: 'integer',
          },
          {
            name: 'operation_type',
            type: 'enum',
            enum: ['CREDIT', 'DEBIT'],
            enumName: 'operation_types',
          },
          {
            name: 'amount',
            type: 'decimal(30, 7)',
          },
          {
            name: 'dt_transaction',
            type: 'timestamp',
            default: 'now()',
          },
          {
            name: 'is_visible',
            type: 'boolean',
            default: true,
          },
          {
            name: 'description',
            type: 'varchar',
          },
          {
            name: 'external_identifier',
            type: 'varchar',
          },
          {
            name: 'transaction_type_id',
            type: 'integer',
            isNullable: true,
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
            name: 'FK_TransactionAccount',
            referencedTableName: 'accounts',
            referencedColumnNames: ['id'],
            columnNames: ['account_id'],
            onDelete: 'RESTRICT',
            onUpdate: 'RESTRICT',
          },
          {
            name: 'FK_TransactionType',
            referencedTableName: 'transaction_types',
            referencedColumnNames: ['id'],
            columnNames: ['transaction_type_id'],
            onDelete: 'RESTRICT',
            onUpdate: 'RESTRICT',
          },
        ],
      })
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('transactions')
  }
}
