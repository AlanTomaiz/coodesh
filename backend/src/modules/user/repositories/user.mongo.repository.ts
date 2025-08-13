import { Collection, Db, ObjectId } from 'mongodb'

import { User } from '../models/user.model'
import { IUserRepository } from './user.repository'

interface UserDocument {
  _id: ObjectId
  name: string
  email: string
  password: string
  createdAt: Date
}

export class UserMongoRepository implements IUserRepository {
  private collection: Collection<UserDocument>

  constructor(db: Db) {
    this.collection = db.collection<UserDocument>('users')
  }

  async getProfile(userId: string) {
    const doc = await this.collection.findOne({ _id: new ObjectId(userId) })
    if (!doc) return null

    return new User(
      doc._id.toHexString(),
      doc.name,
      doc.email,
      doc.password,
      doc.createdAt
    )
  }
}
