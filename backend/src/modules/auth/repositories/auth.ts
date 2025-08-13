import { User } from '@module/user/models/user'

export interface IAuthRepository {
  findByEmail(email: string): Promise<User | null>
  save(user: User): Promise<User>
}
