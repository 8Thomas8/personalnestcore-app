import { Expose, Transform } from 'class-transformer'
import type { CustomRecordView } from '~/types/constants'

export default class CustomRecordDto {
  @Expose()
  id!: number

  @Expose()
  name!: string

  @Expose()
  view!: CustomRecordView | null

  @Expose()
  @Transform(({ value }) => (value ? new Date(value) : value), { toClassOnly: true })
  createdAt!: Date

  @Expose()
  @Transform(({ value }) => (value ? new Date(value) : value), { toClassOnly: true })
  updatedAt!: Date
}
