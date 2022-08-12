import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm'

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

  @OneToMany(() => Account, (account) => account.fiat)
  accounts: Account[]
}
