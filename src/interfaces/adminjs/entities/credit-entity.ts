import { DECIMAL_PRECISION, MAX_DECIMAL_PLACES } from '_core/constants'
import { AccountEntity } from '_interfaces/adminjs/entities/account-entity'
import { AssetEntity } from '_interfaces/adminjs/entities/asset-entity'
import { ColumnNumericTransformer } from '_interfaces/adminjs/utils/column-numeric-transformer'
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm'

@Entity('credits')
@Unique('UNIQUE_CreditAccountAndAsset', ['accountId', 'assetId'])
export class CreditEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  readonly id: number

  @Column({ name: 'asset_id' })
  assetId: number

  @ManyToOne(() => AssetEntity, (asset) => asset.credits)
  @JoinColumn({ name: 'asset_id' })
  asset: AssetEntity

  @Column({ name: 'account_id' })
  accountId: number

  @ManyToOne(() => AccountEntity, (account) => account.credits)
  @JoinColumn({ name: 'account_id' })
  account: AccountEntity

  @Column({ precision: DECIMAL_PRECISION, scale: MAX_DECIMAL_PLACES, transformer: new ColumnNumericTransformer() })
  balance: number

  @Column({
    name: 'average_price',
    precision: DECIMAL_PRECISION,
    scale: MAX_DECIMAL_PLACES,
    transformer: new ColumnNumericTransformer(),
  })
  averagePrice: number

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date
}
