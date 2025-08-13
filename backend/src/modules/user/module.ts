import { Db } from 'mongodb'

import { UserController } from './controllers'
import { FavoriteMongoRepository } from './repositories/favorite.mongo'
import { HistoryMongoRepository } from './repositories/history.mongo'
import { UserMongoRepository } from './repositories/user.mongo'
import { createUserRouter } from './routes'
import { UserService } from './services'

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
