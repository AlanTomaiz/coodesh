import { Router } from 'express'

import { EntriesController } from '../controllers/index.ts'

export function createEntriesRouter(controller: EntriesController) {
  const router = Router()

  router.get('/en', controller.getDictionary.bind(controller))

  return router
}
