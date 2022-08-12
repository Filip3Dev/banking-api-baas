import { DECIMAL_PRECISION, MAX_DECIMAL_PLACES } from '_core/constants'
import { ColumnNumericTransformer } from '_core/utils/column-numeric-transformer'
import { OperationTypes } from '_transaction/enums'
import { Column, CreateDateColumn, Entity, Generated, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'

import { Account } from './account-model'
import { TransactionType } from './transaction-type-model'

@Entity('transactions')
export class Transaction {
  @PrimaryGeneratedColumn()
  readonly id: number

  @Column({ name: 'account_id' })
  accountId: number

  @JoinColumn({ name: 'account_id' })
  account: Account

  @Column({ name: 'uuid' })
  @Generated('uuid')
  uuid: string

  @ManyToOne(() => TransactionType, (type) => type.transactions)
  @JoinColumn({ name: 'transaction_type_id' })
  transactionType: TransactionType

  @Column({
    name: 'operation_type',
    type: 'enum',
    enum: OperationTypes,
    enumName: 'operation_types',
  })
  operationType: OperationTypes

  @Column({ precision: DECIMAL_PRECISION, scale: MAX_DECIMAL_PLACES, transformer: new ColumnNumericTransformer() })
  amount: number

  @CreateDateColumn({ name: 'dt_transaction' })
  dtTransaction: Date

  @Column({ name: 'is_visible', default: true })
  isVisible: boolean

  @Column({ name: 'description' })
  description: string

  @Column({ name: 'reason' })
  reason: string

  @Column({ name: 'external_identifier' })
  externalIdentifier: string
}
