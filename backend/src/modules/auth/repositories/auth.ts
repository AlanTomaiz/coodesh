import { User } from '../../user/model.ts'

export interface IAuthRepository {
  findByEmail(email: string): Promise<User | null>
  save(user: User): Promise<User>
}
