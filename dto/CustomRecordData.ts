import { Expose, Transform, Type } from 'class-transformer'
import 'reflect-metadata'
import CustomRecordDto from '~/dto/CustomRecord'

export default class CustomRecordDataDto {
  @Expose()
  id!: number

  @Expose()
  content!: string

  @Expose()
  @Transform(({ value }) => (value ? new Date(value) : value), { toClassOnly: true })
  datetime!: Date

  @Expose()
  customRecordId!: number

  @Expose()
  @Type(() => CustomRecordDto)
  customRecord!: CustomRecordDto

  @Expose()
  @Transform(({ value }) => (value ? new Date(value) : value), { toClassOnly: true })
  createdAt!: Date

  @Expose()
  @Transform(({ value }) => (value ? new Date(value) : value), { toClassOnly: true })
  updatedAt!: Date

  get date(): string {
    const pad = (num: number) => String(num).padStart(2, '0')
    const day = pad(this.datetime.getDate())
    const month = pad(this.datetime.getMonth() + 1)
    const year = this.datetime.getFullYear()
    return `${day}/${month}/${year}`
  }

  get time(): string {
    const pad = (num: number) => String(num).padStart(2, '0')
    const hours = pad(this.datetime.getHours())
    const minutes = pad(this.datetime.getMinutes())
    return `${hours}:${minutes}`
  }
}
