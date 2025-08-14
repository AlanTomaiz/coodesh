/* eslint-disable @typescript-eslint/no-explicit-any */
import { User } from '@module/user/models/user.model'
import { Collection, Db, ObjectId } from 'mongodb'
import { AuthMongoRepository } from './auth.mongo.repoitory'

describe('AuthMongoRepository', () => {
  let dbMock: jest.Mocked<Db>
  let collectionMock: jest.Mocked<Collection<any>>
  let repo: AuthMongoRepository

  beforeEach(() => {
    collectionMock = {
      findOne: jest.fn(),
      insertOne: jest.fn(),
      createIndex: jest.fn().mockResolvedValue(undefined)
    } as any

    dbMock = {
      collection: jest.fn().mockReturnValue(collectionMock)
    } as any

    repo = new AuthMongoRepository(dbMock)
  })

  it('should be able return an user', async () => {
    collectionMock.findOne.mockResolvedValue({
      _id: new ObjectId('64b88f73a620f842d8123456'),
      name: 'Test',
      email: 'test@test.com',
      password: 'hashed',
      createdAt: new Date()
    })

    const result = await repo.findByEmail('test@test.com')
    expect(result).toBeInstanceOf(User)
    expect(result?.email).toBe('test@test.com')
  })

  it('should be able return null if not exists', async () => {
    collectionMock.findOne.mockResolvedValue(null)

    const result = await repo.findByEmail('test@test.com')
    expect(result).toBeNull()
  })

  it('should be able register and return user entity', async () => {
    const user = new User(
      undefined,
      'Test',
      'test@test.com',
      'hashed',
      new Date()
    )

    collectionMock.insertOne.mockResolvedValue({
      insertedId: new ObjectId('64b88f73a620f842d8123456'),
      acknowledged: true
    })

    const result = await repo.save(user)
    expect(result).toBeInstanceOf(User)
    expect(result).toHaveProperty('id')
    expect(result.id).toBe('64b88f73a620f842d8123456')
  })
})
