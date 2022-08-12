import { MigrationInterface, QueryRunner } from 'typeorm'

export class AlterTransactionTypesNameExtracts1660059658660 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const transactionTypes = [
      { slug: 'CASH_IN_PAYMENT_SLIP', name_extract: 'Depósito Manual' },
      { slug: 'CASH_OUT_MANUAL_PAYMENT', name_extract: 'Saque Manual' },
    ]

    transactionTypes.forEach(async (element) => {
      await queryRunner.query(`UPDATE transaction_types SET name_extract=$1 WHERE slug=$2`, [
        element.name_extract,
        element.slug,
      ])
    })
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const transactionTypes = [
      { slug: 'CASH_IN_PAYMENT_SLIP', name_extract: 'Depósito Boleto Wallet' },
      { slug: 'CASH_OUT_MANUAL_PAYMENT', name_extract: 'Pagamento Manual' },
    ]

    transactionTypes.forEach(async (element) => {
      await queryRunner.query(`UPDATE transaction_types SET name_extract=$1 WHERE slug=$2`, [
        element.name_extract,
        element.slug,
      ])
    })
  }
}
