import { Db } from 'mongodb'

import { AuthController } from './controllers/auth.controller'
import { AuthMongoRepository } from './repositories/auth.mongo.repoitory'
import { createAuthRouter } from './routes/auth.router'
import { AuthService } from './services/auth.service'

export function createAuthModule(db: Db) {
  const mongoRepository = new AuthMongoRepository(db)
  const service = new AuthService(mongoRepository)
  const controller = new AuthController(service)
  const authRouter = createAuthRouter(controller)
  return { authRouter }
}
