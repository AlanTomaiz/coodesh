import { IHistoryRepository } from '@module/user/repositories/history'
import { IEntriesRepository, WordsFilter } from '../repositories/entries'
import { ExternalDictionaryService } from './external-dictionary.service'

interface RequestFindWord {
  userId: string
  word: string
}

export class EntriesService {
  constructor(
    private readonly repository: IEntriesRepository,
    private readonly historyRepository: IHistoryRepository,
    private readonly dictionaryService: ExternalDictionaryService
  ) {}

  async getDictionaryWords(params: WordsFilter) {
    return this.repository.findEntriesWithPage(params)
  }

  async getExternalWordData({ userId, word }: RequestFindWord) {
    const wordData = await this.dictionaryService.fetchWordData(word)

    await this.historyRepository.addWord(userId, word)
    return wordData
  }
}
