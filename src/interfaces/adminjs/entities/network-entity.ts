import { AssetNetworkEntity } from '_interfaces/adminjs/entities/asset-network-entity'
import { TransferEntity } from '_interfaces/adminjs/entities/transfer-entity'
import { BaseEntity, Column, CreateDateColumn, Entity, OneToMany, PrimaryColumn, UpdateDateColumn } from 'typeorm'

@Entity('networks')
export class NetworkEntity extends BaseEntity {
  @PrimaryColumn()
  readonly id: number

  @Column()
  code: string

  @Column()
  name: string

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date

  @OneToMany(() => AssetNetworkEntity, (assetNetwork) => assetNetwork.network)
  assets: AssetNetworkEntity[]

  @OneToMany(() => TransferEntity, (transfer) => transfer.network)
  transfers: TransferEntity[]
}
