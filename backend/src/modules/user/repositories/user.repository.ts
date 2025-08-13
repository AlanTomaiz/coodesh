import { User } from '../models/user.model'

export interface IUserRepository {
  getProfile(userId: string): Promise<User | null>
}
