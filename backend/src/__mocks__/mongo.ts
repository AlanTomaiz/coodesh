/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Collection, Db, Document, InsertOneResult, ObjectId } from 'mongodb'

export function createMockCollection<T extends Document = any>(): jest.Mocked<Collection<T>> {
  return {
    findOne: jest.fn(),
    insertOne: jest.fn(),
    createIndex: jest.fn().mockResolvedValue(undefined)
  } as any
}

export function createMockDb<T extends Document = any>(collectionMock: jest.Mocked<Collection<T>>): jest.Mocked<Db> {
  return {
    collection: jest.fn().mockReturnValue(collectionMock || createMockCollection<T>())
  } as any
}

export function mockInsertOneResult(id: string): InsertOneResult {
  return {
    acknowledged: true,
    insertedId: new ObjectId(id)
  }
}
