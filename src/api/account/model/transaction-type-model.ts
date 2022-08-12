import { OperationTypes } from '_account/enums'
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm'

import { Transaction } from './transaction-model'

@Entity('transaction_types')
export class TransactionType {
  @PrimaryGeneratedColumn()
  readonly id: number

  @Column({ name: 'slug' })
  slug: string

  @Column({ name: 'name_extract' })
  nameExtract: string

  @Column({ name: 'description' })
  description: string

  @Column({
    name: 'operation_type',
    type: 'enum',
    enum: OperationTypes,
    enumName: 'operation_types',
  })
  operationType: OperationTypes

  @Column({ name: 'is_active', default: true })
  isActive: boolean

  @OneToMany(() => Transaction, (transaction) => transaction.transactionType)
  transactions: Transaction[]
}
