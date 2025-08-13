import { Db } from 'mongodb'

import { FavoriteMongoRepository } from '@module/user/repositories/favorite.mongo.repository'
import { HistoryMongoRepository } from '@module/user/repositories/history.mongo.repository'
import { EntriesController } from './controllers/entries.controller'
import { EntriesMongoRepository } from './repositories/entries.mongo.repository'
import { createEntriesRouter } from './routes/entries.router'
import { EntriesService } from './services/entries.service'
import { ExternalDictionaryService } from './services/external-dictionary.service'

export function createEntriesModule(db: Db) {
  const entriesRepository = new EntriesMongoRepository(db)
  const historyRepository = new HistoryMongoRepository(db)
  const favoriteRepository = new FavoriteMongoRepository(db)

  const externalDictionaryService = new ExternalDictionaryService()
  const service = new EntriesService(
    entriesRepository,
    historyRepository,
    favoriteRepository,
    externalDictionaryService
  )

  const controller = new EntriesController(service)
  const entriesRouter = createEntriesRouter(controller)
  return { entriesRouter }
}
