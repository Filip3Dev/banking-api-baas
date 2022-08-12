import { AssetEntity } from '_interfaces/adminjs/entities/asset-entity'
import { NetworkEntity } from '_interfaces/adminjs/entities/network-entity'
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

@Entity('asset_networks')
@Unique('UNIQUE_AssetNetworksAssetAndNetwork', ['assetId', 'networkId'])
export class AssetNetworkEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  readonly id: number

  @Column({ name: 'asset_id' })
  assetId: number

  @ManyToOne(() => AssetEntity, (asset) => asset.networks)
  @JoinColumn({ name: 'asset_id' })
  asset: AssetEntity

  @Column({ name: 'network_id' })
  networkId: number

  @ManyToOne(() => NetworkEntity, (network) => network.assets)
  @JoinColumn({ name: 'network_id' })
  network: NetworkEntity

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date
}
