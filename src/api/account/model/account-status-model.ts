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

@Entity('account_status')
export class AccountStatus {
  @PrimaryGeneratedColumn()
  readonly id: number

  @Column({ name: 'slug' })
  slug: string

  @Column({ name: 'description', nullable: true })
  description: string

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: Date

  @OneToMany(() => Account, (account) => account.status)
  accounts: Account[]
}
