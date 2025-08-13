import { Router } from 'express'

import { EntriesController } from '../controllers'

export function createEntriesRouter(controller: EntriesController) {
  const router = Router()

  router.get('/en', controller.getDictionary.bind(controller))
  router.get('/en/:word', controller.getEntryByWord.bind(controller))

  return router
}
