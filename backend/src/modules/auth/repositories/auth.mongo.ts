import { Collection, Db, ObjectId } from 'mongodb'

import { User } from '../../user/model.ts'
import { IAuthRepository } from './auth.ts'

interface UserDocument {
  _id?: ObjectId
  name: string
  email: string
  password: string
}

export class AuthMongoRepository implements IAuthRepository {
  private collection: Collection<UserDocument>

  constructor(db: Db) {
    this.collection = db.collection<UserDocument>('users')
    this.collection.createIndex({ email: 1 }, { unique: true }).catch(() => {})
  }

  async findByEmail(email: string) {
    const doc = await this.collection.findOne({ email })
    if (!doc) return null

    return new User(doc._id.toString(), doc.name, doc.email, doc.password)
  }

  async save(data: User) {
    const result = await this.collection.insertOne({
      name: data.name,
      email: data.email,
      password: data.password
    })

    return new User(
      result.insertedId.toHexString(),
      data.name,
      data.email,
      data.password
    )
  }
}
