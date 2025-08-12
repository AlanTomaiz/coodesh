import { Db } from 'mongodb'
import { AuthController } from './controller.ts'
import { AuthMongoRepository } from './repositories/auth.mongo.ts'
import { createAuthRouter } from './routes.ts'
import { AuthService } from './service.ts'

export function createAuthModule(db: Db) {
  const mongoRepository = new AuthMongoRepository(db)
  const service = new AuthService(mongoRepository)
  const controller = new AuthController(service)

  const authRouter = createAuthRouter(controller)
  return { authRouter }
}
