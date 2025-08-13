import { Filter, PaginatedResult } from '@shared/types'

interface IndexResults {
  word: string
  added: Date
}

export type FilterResult = PaginatedResult<IndexResults>

export interface IFavoriteRepository {
  addWord(userId: string, word: string): Promise<void>
  removeWord(userId: string, word: string): Promise<void>
  getAll(params: Filter): Promise<FilterResult>
}
