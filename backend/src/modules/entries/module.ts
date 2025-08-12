import { Db } from 'mongodb'

import { EntriesController } from './controllers/index.ts'
import { createEntriesRouter } from './routes/index.ts'

export function createEntriesModule(db: Db) {
  const controller = new EntriesController()
  const entriesRouter = createEntriesRouter(controller)
  return { entriesRouter }
}
