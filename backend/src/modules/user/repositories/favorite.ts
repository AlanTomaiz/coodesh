export interface Filter {
  userId: string
  limit: number
  page: number
}

interface IndexResults {
  word: string
  added: Date
}
export interface IndexReturn {
  results: IndexResults[]
  totalDocs: number
  page: number
  totalPages: number
  hasNext: boolean
  hasPrev: boolean
}

export interface IFavoriteRepository {
  addWord(userId: string, word: string): Promise<void>
  removeWord(userId: string, word: string): Promise<void>
  getAll(params: Filter): Promise<IndexReturn>
}
