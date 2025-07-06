import 'reflect-metadata'
import { Expose, Transform } from 'class-transformer'

export class KitItem {
  @Expose()
  name!: string

  @Expose()
  checked!: boolean
}

export default class KitDto {
  @Expose()
  id!: number

  @Expose()
  name!: string

  @Expose()
  list!: KitItem[]

  @Expose()
  @Transform(({ value }) => (value ? new Date(value) : value), { toClassOnly: true })
  createdAt!: Date

  @Expose()
  @Transform(({ value }) => (value ? new Date(value) : value), { toClassOnly: true })
  updatedAt!: Date
}
