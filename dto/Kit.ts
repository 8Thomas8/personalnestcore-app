import 'reflect-metadata'
import { Expose, Transform } from 'class-transformer'
import { dateToString } from '~/utils/date'

export class KitItem {
  @Expose()
  name!: string

  @Expose()
  checked!: boolean
}

export default class KitDto {
  @Expose()
  id!: string

  @Expose()
  name!: string

  @Expose()
  list!: KitItem[]

  @Expose()
  @Transform(({ value }: { value: string }) => (value ? dateToString(new Date(value)) : value), {
    toClassOnly: true,
  })
  createdAt!: Date

  @Expose()
  @Transform(({ value }: { value: string }) => (value ? dateToString(new Date(value)) : value), {
    toClassOnly: true,
  })
  updatedAt!: Date
}
