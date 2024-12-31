import { Expose } from 'class-transformer'

export default class ApiMeta {
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
