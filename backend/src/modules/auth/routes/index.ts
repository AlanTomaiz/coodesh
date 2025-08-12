import { Router } from 'express'

import { AuthController } from '../controllers/index.ts'

export function createAuthRouter(controller: AuthController) {
  const router = Router()

  router.post('/signup', controller.signup.bind(controller))
  router.post('/signin', controller.signin.bind(controller))

  return router
}
