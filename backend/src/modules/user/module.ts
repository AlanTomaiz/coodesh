import { Db } from 'mongodb'

import { UserController } from './controllers'
import { HistoryMongoRepository } from './repositories/history.mongo'
import { createUserRouter } from './routes'
import { UserService } from './services'

export function createUserModule(db: Db) {
  const historyRepository = new HistoryMongoRepository(db)
  const service = new UserService(historyRepository)
  const controller = new UserController(service)
  const userRouter = createUserRouter(controller)
  return { userRouter }
}
