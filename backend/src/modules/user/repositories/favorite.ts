export interface IFavoriteRepository {
  addWord(userId: string, word: string): Promise<void>
  removeWord(userId: string, word: string): Promise<void>
}
