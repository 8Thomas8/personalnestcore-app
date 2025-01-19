import { Expose } from 'class-transformer'

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
