import { DECIMAL_PRECISION, MAX_DECIMAL_PLACES } from '_core/constants'
import { TransferTypes } from '_core/enums'
import { ColumnNumericTransformer } from '_core/utils/column-numeric-transformer'
import { AccountEntity } from '_interfaces/adminjs/entities/account-entity'
import { AssetEntity } from '_interfaces/adminjs/entities/asset-entity'
import { NetworkEntity } from '_interfaces/adminjs/entities/network-entity'
import { TransferStatusEntity } from '_interfaces/adminjs/entities/transfer-status-entity'
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  JoinColumn,
  ManyToOne,
  UpdateDateColumn,
  BaseEntity,
} from 'typeorm'

const numericColumnMetadata = {
  precision: DECIMAL_PRECISION,
  scale: MAX_DECIMAL_PLACES,
  transformer: new ColumnNumericTransformer(),
}

@Entity('transfers')
export class TransferEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  readonly id: number

  @Column({ name: 'order_id', nullable: true })
  orderId: string

  @Column({ name: 'account_id' })
  accountId: number

  @ManyToOne(() => AccountEntity, (account) => account.transfers)
  @JoinColumn({ name: 'account_id' })
  account: AccountEntity

  @Column({ name: 'asset_id' })
  assetId: number

  @ManyToOne(() => AssetEntity, (asset) => asset.transfers)
  @JoinColumn({ name: 'asset_id' })
  asset: AssetEntity

  @Column({ name: 'network_id' })
  networkId: number

  @ManyToOne(() => NetworkEntity, (asset) => asset.transfers)
  @JoinColumn({ name: 'network_id' })
  network: NetworkEntity

  @Column({ name: 'network_transfer_id', unique: true, nullable: true })
  networkTransferId: string

  @Column({ name: 'exchange_transfer_id' })
  exchangeTransferId: string

  @Column({ ...numericColumnMetadata })
  amount: number

  @Column({ name: 'fees_discounted_amount', ...numericColumnMetadata })
  feesDiscountedAmount: number

  @Column({
    name: 'network_transfer_fee',
    nullable: true,
    ...numericColumnMetadata,
  })
  networkTransferFee: number

  @Column({
    name: 'digital_account_fee_percentage',
    ...numericColumnMetadata,
  })
  digitalAccountFeePercentage: number

  @Column()
  address: string

  @Column({ nullable: true })
  memo: string

  @Column({
    type: 'enum',
    enum: TransferTypes,
    enumName: 'transfer_types',
  })
  type: TransferTypes

  @Column({ name: 'status_id' })
  statusId: number

  @ManyToOne(() => TransferStatusEntity, (status) => status.transfers)
  @JoinColumn({ name: 'status_id' })
  status: TransferStatusEntity

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date
}
