import { User } from '../models/user'

export interface IUserRepository {
  getProfile(userId: string): Promise<User | null>
}
