import { IEntriesRepository, WordsFilter } from '../repositories/entries.ts'

export class EntriesService {
  constructor(private readonly repository: IEntriesRepository) {}

  async getDictionaryWords(params: WordsFilter) {
    return this.repository.findEntriesWithPage(params)
  }
}
