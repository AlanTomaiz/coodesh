export interface IHistoryRepository {
  addWord(userId: string, word: string): Promise<void>
}
