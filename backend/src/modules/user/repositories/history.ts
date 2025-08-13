import { Filter, PaginatedResult } from '@shared/types'

export type FavoriteFilter = Filter & {
  userId: string
}

interface IndexResults {
  word: string
  added: Date
}

type FilterResult = PaginatedResult<IndexResults>

export interface IHistoryRepository {
  addWord(userId: string, word: string): Promise<void>
  getAll(params: FavoriteFilter): Promise<FilterResult>
}
