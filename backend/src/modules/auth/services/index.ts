import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

import { AppError } from '@error/appError.ts'
import { User } from '@module/user/model.ts'
import { IAuthRepository } from '../repositories/auth.ts'

interface RequestCreate {
  name: string
  email: string
  password: string
}

interface RequestAuth {
  email: string
  password: string
}

const BCRYPT_SALT_ROUNDS = process.env.BCRYPT_SALT_ROUNDS! || 10
const JWT_SECRET = process.env.JWT_SECRET! || 'supersecret'

export class AuthService {
  constructor(private readonly repository: IAuthRepository) {}

  private normalizeEmail(email: string) {
    return email.trim().toLowerCase()
  }

  private generateToken(user: User) {
    const payload = { id: user.id, name: user.name, email: user.email }
    return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' })
  }

  async emailExists(email: string) {
    const user = await this.repository.findByEmail(email)
    return !!user
  }

  async createUserWithToken({ name, email, password }: RequestCreate) {
    const normalizeEmail = this.normalizeEmail(email)
    const hash = await bcrypt.hash(password, BCRYPT_SALT_ROUNDS)
    const user = await this.repository.save(
      new User(undefined, name, normalizeEmail, hash)
    )

    const token = this.generateToken(user)
    return { user, token }
  }

  async authenticateUser({ email, password }: RequestAuth) {
    const normalizeEmail = this.normalizeEmail(email)
    const user = await this.repository.findByEmail(normalizeEmail)
    if (!user) {
      throw new AppError('Invalid credentials.')
    }

    const passwordMatch = await bcrypt.compare(password, user.password)
    if (!passwordMatch) {
      throw new AppError('Invalid credentials.')
    }

    const token = this.generateToken(user)
    return { user, token }
  }
}
