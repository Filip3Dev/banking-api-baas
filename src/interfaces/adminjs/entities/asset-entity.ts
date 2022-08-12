import { DECIMAL_PRECISION, MAX_DECIMAL_PLACES } from '_core/constants'
import { AssetNetworkEntity } from '_interfaces/adminjs/entities/asset-network-entity'
import { CategoryEntity } from '_interfaces/adminjs/entities/category-entity'
import { CreditEntity } from '_interfaces/adminjs/entities/credit-entity'
import { FavoriteAssetEntity } from '_interfaces/adminjs/entities/favorite-asset-entity'
import { TransactionEntity } from '_interfaces/adminjs/entities/transaction-entity'
import { TransferEntity } from '_interfaces/adminjs/entities/transfer-entity'
import { ColumnNumericTransformer } from '_interfaces/adminjs/utils/column-numeric-transformer'
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm'

@Entity('assets')
export class AssetEntity extends BaseEntity {
  @PrimaryColumn()
  readonly id: number

  @Column()
  name: string

  @Column()
  symbol: string

  @Column({ name: 'id_metadata', unique: true, nullable: true })
  idMetadata: string

  @Column({ name: 'refresh_rate' })
  refreshRate: number

  @Column({
    name: 'minimum_amount_brl',
    precision: DECIMAL_PRECISION,
    scale: MAX_DECIMAL_PLACES,
    transformer: new ColumnNumericTransformer(),
  })
  minimumAmountBRL: number

  @Column()
  description: string

  @ManyToOne(() => CategoryEntity, (category) => category.assets)
  @JoinColumn({ name: 'category_id' })
  category: CategoryEntity

  @Column({ name: 'category_id' })
  categoryId: number

  @Column({
    name: 'minimum_amount',
    precision: DECIMAL_PRECISION,
    scale: MAX_DECIMAL_PLACES,
    transformer: new ColumnNumericTransformer(),
  })
  minimumAmount: number

  @Column({
    name: 'maximum_amount',
    precision: DECIMAL_PRECISION,
    scale: MAX_DECIMAL_PLACES,
    transformer: new ColumnNumericTransformer(),
  })
  maximumAmount: number

  @Column({
    name: 'minimum_quantity',
    precision: DECIMAL_PRECISION,
    scale: MAX_DECIMAL_PLACES,
    transformer: new ColumnNumericTransformer(),
  })
  minimumQuantity: number

  @Column({
    name: 'maximum_quantity',
    precision: DECIMAL_PRECISION,
    scale: MAX_DECIMAL_PLACES,
    transformer: new ColumnNumericTransformer(),
  })
  maximumQuantity: number

  @Column({
    name: 'quantity_step',
    precision: DECIMAL_PRECISION,
    scale: MAX_DECIMAL_PLACES,
    transformer: new ColumnNumericTransformer(),
  })
  quantityStep: number

  @Column({ name: 'is_active' })
  isActive: boolean

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date

  @OneToMany(() => FavoriteAssetEntity, (favorite) => favorite.asset)
  favorites: FavoriteAssetEntity[]

  @OneToMany(() => TransactionEntity, (transaction) => transaction.asset)
  transactions: TransactionEntity[]

  @OneToMany(() => CreditEntity, (credit) => credit.asset)
  credits: CreditEntity[]

  @OneToMany(() => AssetNetworkEntity, (assetNetwork) => assetNetwork.asset)
  networks: AssetNetworkEntity[]

  @OneToMany(() => TransferEntity, (transfer) => transfer.asset)
  transfers: TransferEntity[]
}
