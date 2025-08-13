import { Request, Response } from 'express'

import { AppError } from '@error/app-error'
import { AuthService } from '../services/auth.service'

export class AuthController {
  constructor(private authService: AuthService) {}

  async signup(req: Request, res: Response) {
    const { name, email, password } = req.body

    if (!name || !email || !password) {
      throw new AppError('Name, email, and password are required.')
    }

    if (typeof password !== 'string' || password.length < 6) {
      throw new AppError('Password must be at least 6 characters.')
    }

    const exists = await this.authService.emailExists(email)
    if (exists) {
      throw new AppError('Email already registered.')
    }

    const { user, token } = await this.authService.createUserWithToken({
      name,
      email,
      password
    })

    return res.status(201).json({
      id: user.id,
      name: user.name,
      token: `Bearer ${token}`
    })
  }

  async signin(req: Request, res: Response) {
    const { email, password } = req.body

    if (!email || !password) {
      throw new AppError('Email and password are required.')
    }

    const { user, token } = await this.authService.authenticateUser({
      email,
      password
    })

    return res.status(200).json({
      id: user.id,
      name: user.name,
      token: `Bearer ${token}`
    })
  }
}
