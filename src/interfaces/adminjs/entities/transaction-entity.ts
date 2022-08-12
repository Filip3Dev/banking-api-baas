import { DECIMAL_PRECISION, MAX_DECIMAL_PLACES } from '_core/constants'
import { TransactionRevertStatuses, TransactionStatuses } from '_core/enums'
import { AccountEntity } from '_interfaces/adminjs/entities/account-entity'
import { AssetEntity } from '_interfaces/adminjs/entities/asset-entity'
import { ColumnNumericTransformer } from '_interfaces/adminjs/utils/column-numeric-transformer'
import { TransactionTypes } from '_transaction/enums'
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'

@Entity('transactions')
export class TransactionEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  readonly id: number

  @Column({ name: 'exchange_transaction_id' })
  exchangeTransactionId: string

  @Column({ name: 'bank_transfer_id' })
  bankTransferId: string

  @Column({ name: 'asset_id' })
  assetId: number

  @ManyToOne(() => AssetEntity, (asset) => asset.transactions)
  @JoinColumn({ name: 'asset_id' })
  asset: AssetEntity

  @Column({ name: 'account_id' })
  accountId: number

  @ManyToOne(() => AccountEntity, (account) => account.transactions)
  @JoinColumn({ name: 'account_id' })
  account: AccountEntity

  @Column({
    name: 'exchange_price',
    precision: DECIMAL_PRECISION,
    scale: MAX_DECIMAL_PLACES,
    transformer: new ColumnNumericTransformer(),
  })
  exchangePrice: number

  @Column({ precision: DECIMAL_PRECISION, scale: MAX_DECIMAL_PLACES, transformer: new ColumnNumericTransformer() })
  price: number

  @Column({ precision: DECIMAL_PRECISION, scale: MAX_DECIMAL_PLACES, transformer: new ColumnNumericTransformer() })
  quantity: number

  @Column({ precision: DECIMAL_PRECISION, scale: MAX_DECIMAL_PLACES, transformer: new ColumnNumericTransformer() })
  total: number

  @Column({
    name: 'base_asset_quotation',
    precision: DECIMAL_PRECISION,
    scale: MAX_DECIMAL_PLACES,
    transformer: new ColumnNumericTransformer(),
  })
  baseAssetQuotation: number

  @Column({
    type: 'enum',
    enum: TransactionTypes,
    enumName: 'transaction_types',
  })
  type: TransactionTypes

  @Column({
    name: 'digital_account_fee',
    precision: DECIMAL_PRECISION,
    scale: MAX_DECIMAL_PLACES,
    transformer: new ColumnNumericTransformer(),
  })
  digitalAccountFee: number

  @Column({
    name: 'exchange_fee',
    precision: DECIMAL_PRECISION,
    scale: MAX_DECIMAL_PLACES,
    transformer: new ColumnNumericTransformer(),
  })
  exchangeFee: number

  @Column({
    type: 'enum',
    enum: TransactionStatuses,
    enumName: 'transaction_statuses',
    default: TransactionStatuses.PENDING,
  })
  status: TransactionStatuses

  @Column({
    name: 'revert_status',
    type: 'enum',
    enum: TransactionRevertStatuses,
    enumName: 'transaction_revert_statuses',
    nullable: true,
  })
  revertStatus: TransactionRevertStatuses

  @Column({ name: 'revert_attempts', default: 0 })
  revertAttempts: number

  @Column({ name: 'revert_bank_transfer_id', nullable: true })
  revertBankTransferId: string

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date
}
