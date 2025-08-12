import { Db, MongoClient, ServerApiVersion } from 'mongodb'

const uri = process.env.MONGODB_URI!
const dbName = process.env.MONGODB_DB!

let client: MongoClient | null = null
let db: Db | null = null

export async function connectMongo(): Promise<Db> {
  if (db) return db

  client = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true
    }
  })

  await client.connect()
  db = client.db(dbName)
  return db
}

export async function disconnectMongo(): Promise<void> {
  if (client) {
    await client.close()
    db = null
    client = null
  }
}
