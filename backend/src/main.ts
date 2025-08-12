import 'dotenv/config'
import express from 'express'
import populateDictionary from './scripts/populate-dictionary.ts'
import { connectMongo } from './shared/database/mongo-client.ts'

const app = express()
app.use(express.json())

async function startServer() {
  const db = await connectMongo()
  await populateDictionary()

  app.listen(process.env.PORT!, () =>
    console.log(`Server is running on port ${process.env.PORT}`)
  )
}

startServer()
