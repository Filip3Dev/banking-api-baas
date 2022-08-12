import { AssetEntity } from '_interfaces/adminjs/entities/asset-entity'
import { BaseEntity, Column, CreateDateColumn, Entity, OneToMany, PrimaryColumn, UpdateDateColumn } from 'typeorm'

@Entity('categories')
export class CategoryEntity extends BaseEntity {
  @PrimaryColumn()
  readonly id: number

  @Column()
  name: string

  @Column()
  description: string

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date

  @OneToMany(() => AssetEntity, (asset) => asset.category)
  assets: AssetEntity[]
}
