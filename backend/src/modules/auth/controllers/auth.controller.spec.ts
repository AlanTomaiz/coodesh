/* eslint-disable @typescript-eslint/no-explicit-any */
import { AppError } from '@error/app-error'
import { User } from '@module/user/models/user.model'
import { AuthService } from '../services/auth.service'
import { AuthController } from './auth.controller'

describe('AuthController', () => {
  let controller: AuthController
  let service: jest.Mocked<AuthService>
  let req: any
  let res: any
  let user: User

  beforeEach(() => {
    service = {
      emailExists: jest.fn(),
      createUserWithToken: jest.fn(),
      authenticateUser: jest.fn()
    } as any

    controller = new AuthController(service)

    req = { body: {}, params: {} }
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    }

    user = {
      id: '1',
      name: 'Test',
      email: 'test@test.com',
      password: '123456',
      createdAt: new Date()
    }
  })

  describe('SignUp', () => {
    it('should be able create a new user', async () => {
      req.body = { name: 'Test', email: 'test@test.com', password: '123456' }

      service.emailExists.mockResolvedValue(false)
      service.createUserWithToken.mockResolvedValue({ user, token: 'token' })

      await controller.signup(req, res)

      expect(res.status).toHaveBeenCalledWith(201)
      expect(res.json).toHaveBeenCalledWith({
        id: '1',
        name: 'Test',
        token: 'Bearer token'
      })
    })

    it('shold be able a throw error if not provided an field', async () => {
      req.body = { name: 'Test', password: '123456' }

      await expect(controller.signup(req, res)).rejects.toThrow(AppError)
    })

    it('shold be able a throw error if the password is not 6 characters long', async () => {
      req.body = { name: 'Test', email: 'test@test.com', password: '12345' }

      await expect(controller.signup(req, res)).rejects.toThrow(AppError)
    })

    it('should be able a throw error if mail already exists', async () => {
      req.body = { name: 'Test', email: 'test@test.com', password: '123456' }

      service.emailExists.mockResolvedValue(true)
      await expect(controller.signup(req, res)).rejects.toThrow(AppError)
    })
  })

  describe('SignIn', () => {
    it('should be able auth user', async () => {
      req.body = { email: 'test@test.com', password: '123456' }

      service.authenticateUser.mockResolvedValue({ user, token: 'token' })
      await controller.signin(req, res)

      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.json).toHaveBeenCalledWith({
        id: '1',
        name: 'Test',
        token: 'Bearer token'
      })
    })

    it('shold be able a throw error if not provided an field', async () => {
      req.body = { email: '' }

      await expect(controller.signin(req, res)).rejects.toThrow(AppError)
    })
  })
})
