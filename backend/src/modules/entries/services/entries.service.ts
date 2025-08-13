import { IFavoriteRepository } from '@module/user/repositories/favorite.repository'
import { IHistoryRepository } from '@module/user/repositories/history.repository'
import { Filter } from '@shared/types'
import { IEntriesRepository } from '../repositories/entries.repository'
import { ExternalDictionaryService } from './external-dictionary.service'

interface Request {
  userId: string
  word: string
}

export class EntriesService {
  constructor(
    private readonly entriesRepository: IEntriesRepository,
    private readonly historyRepository: IHistoryRepository,
    private readonly favoriteRepository: IFavoriteRepository,
    private readonly dictionaryService: ExternalDictionaryService
  ) {}

  async getDictionaryWords(params: Filter) {
    return this.entriesRepository.findEntriesWithPage(params)
  }

  async getExternalWordData({ userId, word }: Request) {
    const wordData = await this.dictionaryService.fetchWordData(word)

    await this.historyRepository.addWord(userId, word)
    return wordData
  }

  async setFavorite({ userId, word }: Request) {
    await this.favoriteRepository.addWord(userId, word)
  }

  async removeFavorite({ userId, word }: Request) {
    await this.favoriteRepository.removeWord(userId, word)
  }
}
