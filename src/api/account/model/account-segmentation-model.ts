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

@Entity('account_segmentations')
export class AccountSegmentation {
  @PrimaryGeneratedColumn()
  readonly id: number

  @Column({ name: 'slug' })
  slug: string

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: Date

  @OneToMany(() => Account, (account) => account.segmentation)
  accounts: Account[]
}
