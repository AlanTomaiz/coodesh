/* eslint-disable @typescript-eslint/no-explicit-any */
import { Collection, Db, ObjectId } from 'mongodb'

import { Filter } from '@shared/types'
import { decodeCursor, encodeCursor } from '@shared/utils'
import { IEntriesRepository } from './entries.repository'

interface WordsDocument {
  _id: ObjectId
  word: string
}

export class EntriesMongoRepository implements IEntriesRepository {
  private collection: Collection<WordsDocument>

  constructor(db: Db) {
    this.collection = db.collection<WordsDocument>('dictionary_words')
  }

  async findEntriesWithPage(params: Filter) {
    const { search, limit, cursor, direction = 'next' } = params

    const baseFilter: any = {}
    if (search) {
      const escapedSearch = search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
      baseFilter.word = { $regex: `^${escapedSearch}`, $options: 'i' }
    }

    const seekFilter: any = {}
    if (cursor) {
      const decodedId = decodeCursor(cursor)
      if (decodedId) {
        const objectId = new ObjectId(decodedId)
        seekFilter._id =
          direction === 'next' ? { $gt: objectId } : { $lt: objectId }
      }
    }

    const totalDocs = await this.collection.countDocuments(baseFilter)
    const sortOrder = direction === 'previous' ? -1 : 1
    let docs = await this.collection
      .find({ $and: [baseFilter, seekFilter] })
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
      results: docs.map((doc) => doc.word),
      totalDocs,
      previous,
      next,
      hasNext: hasExtraDoc,
      hasPrev: !!cursor
    }
  }
}
