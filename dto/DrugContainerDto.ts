import 'reflect-metadata'
import { Expose, Transform } from 'class-transformer'

export default class DrugContainerDto {
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
