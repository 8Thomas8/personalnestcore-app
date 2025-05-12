import 'reflect-metadata'
import { Expose, Transform } from 'class-transformer'

export default class WaterConsumptionRecordDto {
  @Expose()
  id!: number

  @Expose()
  index!: number

  @Expose()
  @Transform(({ value }) => (value ? new Date(value) : value), { toClassOnly: true })
  date!: Date

  @Expose()
  comment!: string | null

  @Expose()
  @Transform(({ value }) => (value ? new Date(value) : value), { toClassOnly: true })
  createdAt!: Date

  @Expose()
  @Transform(({ value }) => (value ? new Date(value) : value), { toClassOnly: true })
  updatedAt!: Date
}
