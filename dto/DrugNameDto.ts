import 'reflect-metadata'
import { Expose, Transform } from 'class-transformer'
import type DrugBrandDto from '~/dto/DrugBrandDto'

export default class DrugNameDto {
  @Expose()
  id!: number

  @Expose()
  name!: string

  @Expose()
  drugBrand!: DrugBrandDto

  @Expose()
  @Transform(({ value }) => (value ? new Date(value) : value), { toClassOnly: true })
  createdAt!: Date

  @Expose()
  @Transform(({ value }) => (value ? new Date(value) : value), { toClassOnly: true })
  updatedAt!: Date
}
