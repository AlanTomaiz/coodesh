import { Router } from 'express'
import { AuthController } from './controller.ts'

export function createAuthRouter(controller: AuthController) {
  const router = Router()

  router.post('/signup', controller.signup.bind(controller))

  return router
}
