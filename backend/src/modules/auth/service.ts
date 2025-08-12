import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { User } from '../user/model.ts'
import { IAuthRepository } from './repositories/auth.ts'

interface RequestCreate {
  name: string
  email: string
  password: string
}

export class AuthService {
  constructor(private readonly repository: IAuthRepository) {}

  async emailExists(email: string) {
    const user = await this.repository.findByEmail(email)
    return !!user
  }

  async createUserWithToken({ name, email, password }: RequestCreate) {
    const hash = await bcrypt.hash(password, 10)
    const user = await this.repository.save(
      new User(undefined, name, email, hash)
    )

    const payload = { id: user.id, name: user.name, email: user.email }
    const token = jwt.sign(payload, process.env.JWT_SECRET!, {
      expiresIn: '7d'
    })

    return { user, token }
  }
}
