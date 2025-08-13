import { Collection, Db, ObjectId } from 'mongodb'

import { decodeCursor, encodeCursor } from '@shared/utils'
import { FavoriteFilter, IFavoriteRepository } from './favorite.repository'

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

  async getAll(params: FavoriteFilter) {
    const { userId, limit, cursor, direction = 'next' } = params

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const seekFilter: any = {}
    if (cursor) {
      const decodedId = decodeCursor(cursor)
      if (decodedId) {
        const objectId = new ObjectId(decodedId)
        seekFilter._id =
          direction === 'next' ? { $gt: objectId } : { $lt: objectId }
      }
    }

    const sortOrder = direction === 'previous' ? -1 : 1
    const totalDocs = await this.collection.countDocuments({ userId })
    let docs = await this.collection
      .find({ userId, ...seekFilter })
      .sort({ _id: sortOrder })
      .limit(limit + 1)
      .toArray()

    const hasExtraDoc = docs.length > limit
    if (hasExtraDoc) docs = docs.slice(0, limit)

    const previous =
      docs.length && !!cursor ? encodeCursor(docs[0]._id.toHexString()) : null

    const next =
      docs.length && hasExtraDoc
        ? encodeCursor(docs[docs.length - 1]._id.toHexString())
        : null

    return {
      results: docs.map((doc) => ({ word: doc.word, added: doc.added })),
      totalDocs,
      previous,
      next,
      hasNext: hasExtraDoc,
      hasPrev: !!cursor
    }
  }
}
