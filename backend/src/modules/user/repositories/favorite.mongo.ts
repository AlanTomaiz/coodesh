import { Collection, Db, ObjectId } from 'mongodb'
import { IFavoriteRepository } from './favorite'

interface FavoriteDocument {
  _id?: ObjectId
  userId: string
  word: string
  favoritedAt: Date
}

export class FavoriteMongoRepository implements IFavoriteRepository {
  private collection: Collection<FavoriteDocument>

  constructor(db: Db) {
    this.collection = db.collection<FavoriteDocument>('user_favorites')
    this.collection
      .createIndex({ userId: 1, word: 1 }, { unique: true })
      .catch(() => {})
  }

  async addWord(userId: string, word: string) {
    await this.collection.updateOne(
      { userId: userId, word },
      { $setOnInsert: { favoritedAt: new Date() } },
      { upsert: true }
    )
  }
}
