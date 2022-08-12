import { ColumnEncryptDataTransformer } from '_core/utils/column-encrypt-data-transformer'
import { CreditEntity } from '_interfaces/adminjs/entities/credit-entity'
import { FavoriteAssetEntity } from '_interfaces/adminjs/entities/favorite-asset-entity'
import { TransactionEntity } from '_interfaces/adminjs/entities/transaction-entity'
import { TransferEntity } from '_interfaces/adminjs/entities/transfer-entity'
import { BaseEntity, Column, CreateDateColumn, Entity, OneToMany, PrimaryColumn, UpdateDateColumn } from 'typeorm'

@Entity('accounts')
export class AccountEntity extends BaseEntity {
  @PrimaryColumn()
  id: number

  @Column({ name: 'external_user_id' })
  externalUserId: string

  @Column({ name: 'exchange_account_id' })
  exchangeAccountId: string

  @Column({
    name: 'api_key',
    transformer: new ColumnEncryptDataTransformer(),
  })
  apiKey: string

  @Column({
    name: 'api_secret',
    transformer: new ColumnEncryptDataTransformer(),
  })
  apiSecret: string

  @Column({ name: 'is_active' })
  isActive: boolean

  @Column({ name: 'is_blocked' })
  isBlocked: boolean

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date

  @OneToMany(() => FavoriteAssetEntity, (favorite) => favorite.account)
  favoriteAssets: FavoriteAssetEntity[]

  @OneToMany(() => TransactionEntity, (transaction) => transaction.asset)
  transactions: TransactionEntity[]

  @OneToMany(() => CreditEntity, (credit) => credit.asset)
  credits: CreditEntity[]

  @OneToMany(() => TransferEntity, (transfer) => transfer.account)
  transfers: TransferEntity[]
}
