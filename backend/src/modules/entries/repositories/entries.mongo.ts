import { Collection, Db, ObjectId } from 'mongodb'

import { IEntriesRepository, WordsFilter } from './entries.ts'

interface WordsDocument {
  _id: ObjectId
  word: string
}

export class EntriesMongoRepository implements IEntriesRepository {
  private collection: Collection<WordsDocument>

  constructor(db: Db) {
    this.collection = db.collection<WordsDocument>('dictionary_words')
  }

  async findEntriesWithPage(params: WordsFilter) {
    const { search, limit = 25, page = 1 } = params

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const baseFilter: any = {}
    if (search) {
      const escapedSearch = search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
      baseFilter.word = { $regex: `^${escapedSearch}`, $options: 'i' }
    }

    const skip = (page - 1) * limit
    const totalDocs = await this.collection.countDocuments(baseFilter)
    const totalPages = Math.ceil(totalDocs / limit)

    const docs = await this.collection
      .find(baseFilter)
      .sort({ word: 1 })
      .skip(skip)
      .limit(limit)
      .toArray()

    return {
      results: docs.map((doc) => doc.word),
      totalDocs,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1
    }
  }
}
