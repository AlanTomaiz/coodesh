import 'dotenv/config'
import express from 'express'

import { createEntriesModule } from '@module/entries/module.ts'
import { ErrorHandler } from './middleware/errorHandler.ts'
import { createAuthModule } from './modules/auth/module.ts'
import { connectMongo } from './shared/database/mongo-client.ts'

async function startServer() {
  const db = await connectMongo()

  const app = express()
  app.use(express.json())
  app.get('/', (_, res) => res.send('Fullstack Challenge 🏅 - Dictionary'))

  const { authRouter } = createAuthModule(db)
  app.use('/auth', authRouter)

  const { entriesRouter } = createEntriesModule(db)
  app.use('/entries', entriesRouter)

  app.use(ErrorHandler.register)

  app.listen(process.env.PORT!, () =>
    console.log(`Server is running on port ${process.env.PORT}`)
  )
}

startServer()
