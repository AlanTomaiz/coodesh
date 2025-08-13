import { Collection, Db, ObjectId } from 'mongodb'
import { Filter, IFavoriteRepository } from './favorite'

interface FavoriteDocument {
  _id?: ObjectId
  userId: string
  word: string
  added: Date
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

  async removeWord(userId: string, word: string) {
    await this.collection.deleteOne({ userId, word })
  }

  async getAll(params: Filter) {
    const { userId, limit = 25, page = 1 } = params

    const skip = (page - 1) * limit
    const totalDocs = await this.collection.countDocuments({ userId })
    const totalPages = Math.ceil(totalDocs / limit)

    const docs = await this.collection
      .find({ userId })
      .sort({ word: 1 })
      .skip(skip)
      .limit(limit)
      .toArray()

    return {
      results: docs.map((doc) => ({ word: doc.word, added: doc.added })),
      totalDocs,
      page,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1
    }
  }
}
