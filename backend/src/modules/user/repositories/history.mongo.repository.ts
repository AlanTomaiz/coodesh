import { Collection, Db, ObjectId } from 'mongodb'

import { Filter } from '@shared/types'
import { decodeCursor, encodeCursor } from '@shared/utils'
import { IHistoryRepository } from './history.repository'

interface HistoryDocument {
  _id?: ObjectId
  userId: string
  word: string
  added: Date
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
      { $setOnInsert: { added: new Date() } },
      { upsert: true }
    )
  }

  async getAll(params: Filter) {
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

    const totalDocs = await this.collection.countDocuments({ userId })
    const sortOrder = direction === 'previous' ? -1 : 1
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
