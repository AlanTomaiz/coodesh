export interface IFavoriteRepository {
  addWord(userId: string, word: string): Promise<void>
}
