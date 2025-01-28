import { Expose, Transform } from 'class-transformer'
import type DrugNameDto from '~/dto/DrugNameDto'
import type { DrugForm, DrugUnit } from '~/types/constants'
import type DrugBrandDto from '~/dto/DrugBrandDto'
import { dateToString, stringToDate } from '~/utils/date'

export default class UserDrugDto {
  @Expose()
  id!: number

  @Expose()
  drugBrandId!: number

  @Expose()
  drugBrand?: DrugBrandDto

  @Expose()
  drugNameId!: number

  @Expose()
  drugName?: DrugNameDto

  @Expose()
  form!: DrugForm

  @Expose()
  dose!: number

  @Expose()
  note!: string | null

  @Expose()
  unit!: DrugUnit

  @Expose()
  quantity!: number

  @Expose()
  @Transform(({ value }: { value: string }) => (value ? dateToString(new Date(value)) : value), {
    toClassOnly: true,
  })
  @Transform(({ value }: { value: string }) => (value ? value : value), {
    toPlainOnly: true,
  })
  expirationDateTime!: string

  @Transform(({ value }) => (value ? new Date(value) : value), { toClassOnly: true })
  createdAt!: Date

  @Expose()
  @Transform(({ value }) => (value ? new Date(value) : value), { toClassOnly: true })
  updatedAt!: Date

  get isExpireSoon(): boolean {
    const today = new Date()
    const nextSixtyDays = new Date(today)
    nextSixtyDays.setDate(today.getDate() + 60)
    const expirationDate = stringToDate(this.expirationDateTime)
    return expirationDate > today && expirationDate <= nextSixtyDays
  }

  get isExpired(): boolean {
    const today = new Date()
    const expirationDate = stringToDate(this.expirationDateTime)
    return expirationDate < today
  }
}
