import 'dotenv/config'
import express from 'express'

import { createAuthModule } from '@module/auth/module'
import { createEntriesModule } from '@module/entries/module'
import { connectMongo } from '@shared/database/mongo-client'
import { EnsureAuthenticated } from '@shared/middleware/ensure-authenticated'
import { ErrorHandler } from '@shared/middleware/errorHandler'

async function startServer() {
  const db = await connectMongo()

  const app = express()
  app.use(express.json())

  app.get('/', (_, res) => res.send('Fullstack Challenge 🏅 - Dictionary'))

  const { authRouter } = createAuthModule(db)
  app.use('/auth', authRouter)

  const { entriesRouter } = createEntriesModule(db)
  app.use('/entries', EnsureAuthenticated.register, entriesRouter)

  app.use(ErrorHandler.register)

  app.listen(process.env.PORT!, () =>
    console.log(`Server is running on port ${process.env.PORT}`)
  )
}

startServer()
