export interface WordsFilter {
  search?: string
  limit: number
  page: number
}

export interface IndexReturn {
  results: string[]
  totalDocs: number
  totalPages: number
  hasNext: boolean
  hasPrev: boolean
}

export interface IEntriesRepository {
  findEntriesWithPage(params: WordsFilter): Promise<IndexReturn>
}
