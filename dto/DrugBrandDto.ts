import { Expose, Transform } from 'class-transformer'
import 'reflect-metadata'

export default class DrugBrandDto {
  @Expose()
  id!: number

  @Expose()
  name!: string

  @Expose()
  @Transform(({ value }) => (value ? new Date(value) : value), { toClassOnly: true })
  createdAt!: Date

  @Expose()
  @Transform(({ value }) => (value ? new Date(value) : value), { toClassOnly: true })
  updatedAt!: Date
}
