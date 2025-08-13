import { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'

import { AppError } from '@error/appError'

const JWT_SECRET = process.env.JWT_SECRET! || 'supersecret'

export class EnsureAuthenticated {
  static register(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AppError('Token not provided.', 401)
    }

    const token = authHeader.replace('Bearer ', '').trim()

    try {
      const payload = jwt.verify(token, JWT_SECRET) as { id: string }
      req.userid = payload.id
      return next()
    } catch (err) {
      throw new AppError('Invalid or expired token.', 401)
    }
  }
}
