import { Router } from 'express'
import { UserController } from '../controllers'

export function createUserRouter(controller: UserController) {
  const router = Router()

  router.get('/me/history', controller.indexHistory.bind(controller))
  router.get('/me/favorites', controller.indexFavorites.bind(controller))

  return router
}
