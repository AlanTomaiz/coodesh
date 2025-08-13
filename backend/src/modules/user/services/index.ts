import { Filter, IHistoryRepository } from '../repositories/history'

export class UserService {
  constructor(private readonly historyRepository: IHistoryRepository) {}

  async listHistory(params: Filter) {
    return this.historyRepository.getAll(params)
  }

  async listFavorites(params: Filter) {
    return this.historyRepository.getAll(params)
  }
}
