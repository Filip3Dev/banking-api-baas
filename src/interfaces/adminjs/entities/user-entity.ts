import { BaseEntity, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm'

export enum UserRoles {
  ADMIN = 'admin',
  STAFF = 'staff',
}

@Entity('users')
export class UserEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ name: 'email', unique: true })
  email: string

  @Column({ name: 'hashed_password' })
  hashedPassword: string

  @Column({ name: 'role', type: 'enum', enum: UserRoles, enumName: 'user_roles', default: UserRoles.STAFF })
  role: string

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date
}
