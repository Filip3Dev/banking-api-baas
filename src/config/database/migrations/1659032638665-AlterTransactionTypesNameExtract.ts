import { MigrationInterface, QueryRunner } from 'typeorm'

export class AlterTransactionTypesNameExtract1659032638665 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const transactionTypes = [
      { slug: 'BUY_CRYPTO', name_extract: 'Compra de Criptomoeda' },
      { slug: 'CASH_IN', name_extract: 'Depósito PIX Wallet' },
      { slug: 'CASH_OUT', name_extract: 'Saque PIX Wallet' },
      { slug: 'DEPOSIT_FINANCE', name_extract: 'Investimento Finance' },
      { slug: 'REVERT_CASH_OUT', name_extract: 'Estorno Saque Wallet' },
      { slug: 'REVERT_BUY', name_extract: 'Estorno Compra de Criptomoeda' },
      { slug: 'SELL_CRYPTO', name_extract: 'Venda de Criptomoeda' },
      { slug: 'START', name_extract: 'Criação de conta' },
      { slug: 'TRANSFER_BAAS_WALLET', name_extract: 'Transferência Conta Digital para Wallet' },
      { slug: 'TRANSFER_IN_P2P_WALLET', name_extract: 'Transferência Recebida' },
      { slug: 'TRANSFER_OUT_P2P_WALLET', name_extract: 'Transferência Enviada' },
      { slug: 'WITHDRAW_FINANCE', name_extract: 'Resgate Finance' },
      { slug: 'MIGRATION_BAAS_DOCK', name_extract: 'Migração Conta Digital' },
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

  public async down(queryRunner: QueryRunner): Promise<void> {
    const transactionTypes = [
      { slug: 'BUY_CRYPTO', name_extract: 'BUY_CRYPTO' },
      { slug: 'CASH_IN', name_extract: 'CASH_IN' },
      { slug: 'CASH_OUT', name_extract: 'CASH_OUT' },
      { slug: 'DEPOSIT_FINANCE', name_extract: 'DEPOSIT_FINANCE' },
      { slug: 'REVERT_CASH_OUT', name_extract: 'REVERT_CASH_OUT' },
      { slug: 'REVERT_BUY', name_extract: 'REVERT_BUY' },
      { slug: 'SELL_CRYPTO', name_extract: 'SELL_CRYPTO' },
      { slug: 'START', name_extract: 'START' },
      { slug: 'TRANSFER_BAAS_WALLET', name_extract: 'TRANSFER_BAAS_WALLET' },
      { slug: 'TRANSFER_IN_P2P_WALLET', name_extract: 'TRANSFER_IN_P2P_WALLET' },
      { slug: 'TRANSFER_OUT_P2P_WALLET', name_extract: 'TRANSFER_OUT_P2P_WALLET' },
      { slug: 'WITHDRAW_FINANCE', name_extract: 'WITHDRAW_FINANCE' },
      { slug: 'MIGRATION_BAAS_DOCK', name_extract: 'MIGRATION_BAAS_DOCK' },
      { slug: 'CASH_IN_PAYMENT_SLIP', name_extract: 'CASH_IN_PAYMENT_SLIP' },
      { slug: 'CASH_OUT_MANUAL_PAYMENT', name_extract: 'CASH_OUT_MANUAL_PAYMENT' },
    ]

    transactionTypes.forEach(async (element) => {
      await queryRunner.query(`UPDATE transaction_types SET name_extract=$1 WHERE slug=$2`, [
        element.name_extract,
        element.slug,
      ])
    })
  }
}
