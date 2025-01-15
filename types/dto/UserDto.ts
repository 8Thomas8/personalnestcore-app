import { Expose, Transform } from 'class-transformer'

export default class UserDto {
  @Expose()
  id!: string

  @Expose()
  email!: string

  @Expose()
  @Transform(({ value }) => (value ? new Date(value) : value), { toClassOnly: true })
  createdAt!: Date

  @Expose()
  @Transform(({ value }) => (value ? new Date(value) : value), { toClassOnly: true })
  updatedAt!: Date
}
