import { Db } from 'mongodb'

import { HistoryMongoRepository } from '@module/user/repositories/history.mongo'
import { EntriesController } from './controllers'
import { EntriesMongoRepository } from './repositories/entries.mongo'
import { createEntriesRouter } from './routes'
import { EntriesService } from './services/entries.service'
import { ExternalDictionaryService } from './services/external-dictionary.service'

export function createEntriesModule(db: Db) {
  const entriesRepository = new EntriesMongoRepository(db)
  const historyRepository = new HistoryMongoRepository(db)

  const externalDictionaryService = new ExternalDictionaryService()
  const service = new EntriesService(
    entriesRepository,
    historyRepository,
    externalDictionaryService
  )

  const controller = new EntriesController(service)
  const entriesRouter = createEntriesRouter(controller)
  return { entriesRouter }
}
