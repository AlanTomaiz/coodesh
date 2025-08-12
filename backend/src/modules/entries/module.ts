import { Db } from 'mongodb'

import { EntriesController } from './controllers/index.ts'
import { EntriesMongoRepository } from './repositories/entries.mongo.ts'
import { createEntriesRouter } from './routes/index.ts'
import { EntriesService } from './services/index.ts'

export function createEntriesModule(db: Db) {
  const mongoRepository = new EntriesMongoRepository(db)
  const service = new EntriesService(mongoRepository)
  const controller = new EntriesController(service)
  const entriesRouter = createEntriesRouter(controller)
  return { entriesRouter }
}
