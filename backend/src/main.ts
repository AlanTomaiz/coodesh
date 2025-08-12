import 'dotenv/config'
import express from 'express'
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

  app.use(ErrorHandler.register)

  app.listen(process.env.PORT!, () =>
    console.log(`Server is running on port ${process.env.PORT}`)
  )
}

startServer()
