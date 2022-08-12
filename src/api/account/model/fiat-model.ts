import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'

import { Account } from './account-model'

@Entity('fiats')
export class Fiat {
  @PrimaryGeneratedColumn()
  readonly id: number

  @Column({ name: 'name' })
  name: string

  @Column({ name: 'symbol' })
  symbol: string

  @Column({ name: 'is_active', default: true })
  isActive: boolean

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: Date

  @OneToMany(() => Account, (account) => account.fiat)
  accounts: Account[]
}
