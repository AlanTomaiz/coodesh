import { Router } from 'express'

import { EntriesController } from '../controllers/entries.controller'

export function createEntriesRouter(controller: EntriesController) {
  const router = Router()

  router.get('/en', controller.getDictionary.bind(controller))

  router.get('/en/:word', controller.getEntryByWord.bind(controller))

  router.post(
    '/entries/en/:word/favorite',
    controller.setFavorite.bind(controller)
  )

  router.delete(
    '/entries/en/:word/unfavorite',
    controller.setFavorite.bind(controller)
  )

  return router
}
