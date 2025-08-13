import { Filter, PaginatedResult } from '@shared/types'

type FilterResult = PaginatedResult<string>
export interface IEntriesRepository {
  findEntriesWithPage(params: Filter): Promise<FilterResult>
}
