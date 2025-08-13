import { AppError } from '@error/app-error'
import { Filter } from '@shared/types'
import { IFavoriteRepository } from '../repositories/favorite.repository'
import { IHistoryRepository } from '../repositories/history.repository'
import { IUserRepository } from '../repositories/user.repository'

export class UserService {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly historyRepository: IHistoryRepository,
    private readonly favoriteRepository: IFavoriteRepository
  ) {}

  async getProfile(userId: string) {
    const user = await this.userRepository.getProfile(userId)
    if (!user) throw new AppError('User not found', 404)

    const { password, ...userWithoutPassword } = user
    return userWithoutPassword
  }

  async listHistory(params: Filter) {
    return this.historyRepository.getAll(params)
  }

  async listFavorites(params: Filter) {
    return this.favoriteRepository.getAll(params)
  }
}
