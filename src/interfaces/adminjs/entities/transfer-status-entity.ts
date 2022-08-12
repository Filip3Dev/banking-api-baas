import { TransferTypes } from '_core/enums'
import { TransferEntity } from '_interfaces/adminjs/entities/transfer-entity'
import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, OneToMany, CreateDateColumn } from 'typeorm'

@Entity('transfer_status')
export class TransferStatusEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  readonly id: number

  @Column({ name: 'exchange_status_id' })
  exchangeStatusId: number

  @Column()
  description: string

  @Column({
    name: 'transfer_type',
    type: 'enum',
    enum: TransferTypes,
    enumName: 'transfer_types',
  })
  transferType: TransferTypes

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date

  @OneToMany(() => TransferEntity, (transfer) => transfer.status)
  transfers: TransferEntity[]
}
