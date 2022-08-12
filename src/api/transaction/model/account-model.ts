import { DECIMAL_PRECISION, MAX_DECIMAL_PLACES } from '_core/constants'
import { ColumnNumericTransformer } from '_core/utils/column-numeric-transformer'
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'

import { AccountSegmentation } from './account-segmentation-model'
import { AccountStatus } from './account-status-model'
import { Fiat } from './fiat-model'
import { Transaction } from './transaction-model'

@Entity('accounts')
export class Account {
  @PrimaryGeneratedColumn()
  readonly id: number

  @Column({ name: 'external_user_id' })
  externalUserId: string

  @Column({
    name: 'limit',
    precision: DECIMAL_PRECISION,
    scale: MAX_DECIMAL_PLACES,
    transformer: new ColumnNumericTransformer(),
  })
  limit: number

  @Column({
    name: 'balance',
    precision: DECIMAL_PRECISION,
    scale: MAX_DECIMAL_PLACES,
    transformer: new ColumnNumericTransformer(),
  })
  balance: number

  @ManyToOne(() => Fiat, (fiat) => fiat.accounts)
  @JoinColumn({ name: 'fiat_id' })
  fiat: Fiat

  @ManyToOne(() => AccountSegmentation, (segmentation) => segmentation.accounts)
  @JoinColumn({ name: 'segmentation_id' })
  segmentation: AccountSegmentation

  @ManyToOne(() => AccountStatus, (status) => status.accounts)
  @JoinColumn({ name: 'status_id' })
  status: AccountStatus

  @Column({ name: 'is_blocked', default: false })
  isBlocked: boolean

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: Date

  @OneToMany(() => Transaction, (transaction) => transaction.account)
  transactions: Transaction[]
}
