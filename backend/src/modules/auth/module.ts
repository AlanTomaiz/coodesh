import { Db } from 'mongodb'

import { AuthController } from './controllers'
import { AuthMongoRepository } from './repositories/auth.mongo'
import { createAuthRouter } from './routes'
import { AuthService } from './services'

export function createAuthModule(db: Db) {
  const mongoRepository = new AuthMongoRepository(db)
  const service = new AuthService(mongoRepository)
  const controller = new AuthController(service)
  const authRouter = createAuthRouter(controller)
  return { authRouter }
}
