import { Collection, Db, ObjectId } from 'mongodb'

import { IHistoryRepository } from './history'

interface HistoryDocument {
  _id?: ObjectId
  userId: string
  word: string
  viewedAt: Date
}

export class HistoryMongoRepository implements IHistoryRepository {
  private collection: Collection<HistoryDocument>

  constructor(db: Db) {
    this.collection = db.collection<HistoryDocument>('user_history')
    this.collection
      .createIndex({ userId: 1, word: 1 }, { unique: true })
      .catch(() => {})
  }

  async addWord(userId: string, word: string) {
    await this.collection.updateOne(
      { userId, word },
      { $setOnInsert: { viewedAt: new Date() } },
      { upsert: true }
    )
  }
}
