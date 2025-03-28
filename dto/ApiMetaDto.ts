import { Expose } from 'class-transformer'
import 'reflect-metadata'

export default class ApiMetaDto {
  @Expose()
  total!: number

  @Expose()
  perPage!: number

  @Expose()
  currentPage!: number

  @Expose()
  lastPage!: number

  @Expose()
  firstPage!: number
}
