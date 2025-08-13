export type Filter = {
  search?: string
  limit: number
  cursor?: string
  direction: 'next' | 'previous'
}

export type PaginatedResult<T> = {
  results: T[]
  totalDocs: number
  previous: string | null
  next: string | null
  hasNext: boolean
  hasPrev: boolean
}
