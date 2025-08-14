import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

import { AppError } from '@error/app-error'
import { User } from '@module/user/models/user.model'
import { IAuthRepository } from '../repositories/auth.repoitory'
import { AuthService } from './auth.service'

jest.mock('bcryptjs')
jest.mock('jsonwebtoken')

describe('AuthService', () => {
  let repository: jest.Mocked<IAuthRepository>
  let service: AuthService

  beforeEach(() => {
    repository = {
      findByEmail: jest.fn(),
      save: jest.fn()
    }

    service = new AuthService(repository)
  })

  it('should be able return true if mail already exists', async () => {
    repository.findByEmail.mockResolvedValue({} as User)

    const result = await service.emailExists('test@test.com')
    expect(result).toBe(true)
  })

  it('should be able return false if mail not exists', async () => {
    repository.findByEmail.mockResolvedValue(null)

    const result = await service.emailExists('test@test.com')
    expect(result).toBe(false)
  })

  it('should be able create a new user and return token', async () => {
    ;(bcrypt.hash as jest.Mock).mockResolvedValue('hashed')
    ;(jwt.sign as jest.Mock).mockReturnValue('token')

    const user = new User('1', 'Test', 'test@test.com', 'hashed', new Date())
    repository.save.mockResolvedValue(user)

    const result = await service.createUserWithToken({
      name: 'Test',
      email: 'test@test.com',
      password: '123456'
    })

    expect(result.user).toEqual(user)
    expect(result.token).toBe('token')
  })

  it('should be able auth uer and return token', async () => {
    ;(bcrypt.compare as jest.Mock).mockResolvedValue(true)
    ;(jwt.sign as jest.Mock).mockReturnValue('token')

    const user = new User('1', 'Test', 'test@test.com', 'hashed', new Date())
    repository.findByEmail.mockResolvedValue(user)

    const result = await service.authenticateUser({
      email: 'test@test.com',
      password: '123456'
    })

    expect(result.user).toEqual(user)
    expect(result.token).toBe('token')
  })

  it('should be able a throw error if mail not exists', async () => {
    repository.findByEmail.mockResolvedValue(null)

    await expect(
      service.authenticateUser({ email: 'test@test.com', password: '123456' })
    ).rejects.toThrow(AppError)
  })

  it('should be able a throw error if password is incorrect', async () => {
    ;(bcrypt.compare as jest.Mock).mockResolvedValue(false)

    const user = new User('1', 'Test', 'test@test.com', 'hashed', new Date())
    repository.findByEmail.mockResolvedValue(user)

    await expect(
      service.authenticateUser({ email: 'test@test.com', password: 'wrong' })
    ).rejects.toThrow(AppError)
  })
})
