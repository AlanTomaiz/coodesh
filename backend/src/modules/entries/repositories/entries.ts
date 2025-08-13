export interface Filter {
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
  findEntriesWithPage(params: Filter): Promise<IndexReturn>
}
