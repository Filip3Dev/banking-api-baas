import { AccountEntity } from '_interfaces/adminjs/entities/account-entity'
import { AssetEntity } from '_interfaces/adminjs/entities/asset-entity'
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm'

@Entity('favorite_assets')
@Unique('UNIQUE_FavoriteAssetAccountAndAsset', ['accountId', 'assetId'])
export class FavoriteAssetEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  readonly id: number

  @Column({ name: 'account_id' })
  accountId: number

  @ManyToOne(() => AccountEntity, (account) => account.favoriteAssets)
  @JoinColumn({ name: 'account_id' })
  account: AccountEntity

  @Column({ name: 'asset_id' })
  assetId: number

  @ManyToOne(() => AssetEntity, (asset) => asset.favorites)
  @JoinColumn({ name: 'asset_id' })
  asset: AssetEntity

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date
}
