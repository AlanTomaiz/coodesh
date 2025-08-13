import { AppError } from '@error/appError'

export class ExternalDictionaryService {
  private readonly baseUrl = 'https://api.dictionaryapi.dev/api/v2/entries/en'

  async fetchWordData(word: string) {
    const response = await fetch(`${this.baseUrl}/${encodeURIComponent(word)}`)

    if (!response.ok)
      throw new AppError(`Word "${word}" not found in dictionary.`, 404)

    return response.json()
  }
}
