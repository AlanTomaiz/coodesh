import { Db } from 'mongodb'

import { UserController } from './controllers/user.controller'
import { FavoriteMongoRepository } from './repositories/favorite.mongo.repository'
import { HistoryMongoRepository } from './repositories/history.mongo.repository'
import { UserMongoRepository } from './repositories/user.mongo.repository'
import { createUserRouter } from './routes/user.router'
import { UserService } from './services/user.service'

export function createUserModule(db: Db) {
  const userRepository = new UserMongoRepository(db)
  const historyRepository = new HistoryMongoRepository(db)
  const FavoriteRepository = new FavoriteMongoRepository(db)

  const service = new UserService(
    userRepository,
    historyRepository,
    FavoriteRepository
  )

  const controller = new UserController(service)
  const userRouter = createUserRouter(controller)
  return { userRouter }
}
