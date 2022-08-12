import { DECIMAL_PRECISION, MAX_DECIMAL_PLACES } from '_core/constants'
import { BaseEntity, Column, CreateDateColumn, Entity, PrimaryColumn, UpdateDateColumn } from 'typeorm'

import { ColumnNumericTransformer } from '../utils/column-numeric-transformer'

@Entity('app_settings')
export class AppSettingsEntity extends BaseEntity {
  @PrimaryColumn()
  readonly id: number

  @Column({
    name: 'buying_fee_percentage',
    precision: DECIMAL_PRECISION,
    scale: MAX_DECIMAL_PLACES,
    transformer: new ColumnNumericTransformer(),
  })
  buyingFeePercentage: number

  @Column({
    name: 'buying_exchange_fee_percentage',
    precision: DECIMAL_PRECISION,
    scale: MAX_DECIMAL_PLACES,
    transformer: new ColumnNumericTransformer(),
  })
  buyingExchangeFeePercentage: number

  @Column({
    name: 'selling_fee_percentage',
    precision: DECIMAL_PRECISION,
    scale: MAX_DECIMAL_PLACES,
    transformer: new ColumnNumericTransformer(),
  })
  sellingFeePercentage: number

  @Column({
    name: 'selling_exchange_fee_percentage',
    precision: DECIMAL_PRECISION,
    scale: MAX_DECIMAL_PLACES,
    transformer: new ColumnNumericTransformer(),
  })
  sellingExchangeFeePercentage: number

  @Column({
    name: 'withdraw_fee_percentage',
    precision: DECIMAL_PRECISION,
    scale: MAX_DECIMAL_PLACES,
    transformer: new ColumnNumericTransformer(),
  })
  withdrawFeePercentage: number

  @Column({
    name: 'fees_validity_start_date',
    nullable: true,
  })
  feesValidityStartDate: Date

  @Column({
    name: 'fees_validity_end_date',
    nullable: true,
  })
  feesValidityEndDate: Date

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date
}
