import { NextFunction, Request, Response } from 'express'
import { AppError } from '../errors/appError.ts'

export class ErrorHandler {
  static register(error: Error, req: Request, res: Response, _: NextFunction) {
    if (error instanceof AppError) {
      res
        .status(error.statusCode)
        .json({ status: 'error', message: error.message })
      return
    }

    console.log(error.message)
    res.status(500).json({ status: 'error', message: 'Internal server error' })
  }
}
