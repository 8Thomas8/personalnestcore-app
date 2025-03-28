import { Expose, Transform } from 'class-transformer'
import type DrugBrandDto from '~/dto/DrugBrandDto'
import 'reflect-metadata'

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
