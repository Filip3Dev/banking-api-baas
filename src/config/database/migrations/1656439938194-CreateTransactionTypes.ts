import { MigrationInterface, QueryRunner, Table } from 'typeorm'

export class CreateTransactionType1656439938194 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const tableName = 'transaction_types'
    const transactionTypes = [
      'BUY_CRYPTO',
      'CASH_IN',
      'CASH_OUT',
      'DEPOSIT_FINANCE',
      'REVERT_SELL',
      'REVERT_BUY',
      'SELL_CRYPTO',
      'START',
      'TRANSFER_BAAS_WALLET',
      'TRANSFER_IN_P2P_WALLET',
      'TRANSFER_OUT_P2P_WALLET',
      'WITHDRAW_FINANCE',
      'MIGRATION_BAAS_DOCK',
      'CASH_IN_PAYMENT_SLIP',
      'CASH_OUT_MANUAL_PAYMENT',
    ]

    await queryRunner.createTable(
      new Table({
        name: tableName,
        columns: [
          {
            name: 'id',
            type: 'integer',
            isGenerated: true,
            generationStrategy: 'increment',
            isPrimary: true,
          },
          {
            name: 'slug',
            type: 'varchar',
          },
          {
            name: 'name_extract',
            type: 'varchar',
          },
          {
            name: 'description',
            type: 'varchar',
          },
          {
            name: 'operation_type',
            type: 'enum',
            enum: ['CREDIT', 'DEBIT'],
            enumName: 'operation_types',
          },
          {
            name: 'is_active',
            type: 'boolean',
            default: true,
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
      })
    )

    await queryRunner.query(
      `INSERT INTO ${tableName} (
        slug,
        name_extract,
        description,
        operation_type
      ) VALUES
      ($1, $2, $3, $4),
      ($5, $6, $7, $8),
      ($9, $10, $11, $12),
      ($13, $14, $15, $16),
      ($17, $18, $19, $20),
      ($21, $22, $23, $24),
      ($25, $26, $27, $28),
      ($29, $30, $31, $32),
      ($33, $34, $35, $36),
      ($37, $38, $39, $40),
      ($41, $42, $43, $44),
      ($45, $46, $47, $48),
      ($49, $50, $51, $52),
      ($53, $54, $55, $56),
      ($57, $58, $59, $60);`,
      [
        transactionTypes[0],
        transactionTypes[0],
        transactionTypes[0],
        'DEBIT',
        transactionTypes[1],
        transactionTypes[1],
        transactionTypes[1],
        'CREDIT',
        transactionTypes[2],
        transactionTypes[2],
        transactionTypes[2],
        'DEBIT',
        transactionTypes[3],
        transactionTypes[3],
        transactionTypes[3],
        'DEBIT',
        transactionTypes[4],
        transactionTypes[4],
        transactionTypes[4],
        'DEBIT',
        transactionTypes[5],
        transactionTypes[5],
        transactionTypes[5],
        'CREDIT',
        transactionTypes[6],
        transactionTypes[6],
        transactionTypes[6],
        'CREDIT',
        transactionTypes[7],
        transactionTypes[7],
        transactionTypes[7],
        'CREDIT',
        transactionTypes[8],
        transactionTypes[8],
        transactionTypes[8],
        'CREDIT',
        transactionTypes[9],
        transactionTypes[9],
        transactionTypes[9],
        'CREDIT',
        transactionTypes[10],
        transactionTypes[10],
        transactionTypes[10],
        'DEBIT',
        transactionTypes[11],
        transactionTypes[11],
        transactionTypes[11],
        'CREDIT',
        transactionTypes[12],
        transactionTypes[12],
        transactionTypes[12],
        'CREDIT',
        transactionTypes[13],
        transactionTypes[13],
        transactionTypes[13],
        'CREDIT',
        transactionTypes[14],
        transactionTypes[14],
        transactionTypes[14],
        'DEBIT',
      ]
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('transaction_types')
  }
}
