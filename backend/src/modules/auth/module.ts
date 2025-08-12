import { Db } from 'mongodb'

import { AuthController } from './controllers/index.ts'
import { AuthMongoRepository } from './repositories/auth.mongo.ts'
import { createAuthRouter } from './routes/index.ts'
import { AuthService } from './services/index.ts'

export function createAuthModule(db: Db) {
  const mongoRepository = new AuthMongoRepository(db)
  const service = new AuthService(mongoRepository)
  const controller = new AuthController(service)

  const authRouter = createAuthRouter(controller)
  return { authRouter }
}
