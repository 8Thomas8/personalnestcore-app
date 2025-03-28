import 'reflect-metadata'
import { Expose, Transform } from 'class-transformer'
import { dateToString } from '~/utils/date'

export default class UserDto {
  @Expose()
  id!: string

  @Expose()
  username!: string

  @Expose()
  role!: string

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

  @Expose()
  password?: string
}
