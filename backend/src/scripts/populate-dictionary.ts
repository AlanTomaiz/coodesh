import {
  connectMongo,
  disconnectMongo
} from '../shared/database/mongo-client.ts'

const GITHUB_WORDS_URL = process.env.GITHUB_WORDS_URL!
const COLLECTION = 'dictionary_words'

async function fetchWordsList(url: string): Promise<string[]> {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`Failed to fetch word list: ${res.statusText}`)
  const text = await res.text()
  return text
    .split('\n')
    .map((word) => word.trim())
    .filter(Boolean)
}

export default async function populateDictionary() {
  try {
    const db = await connectMongo()

    // Busca lista de palavras do arquivo no GitHub
    console.log('Fetching wordlist from GitHub...')
    const words = await fetchWordsList(GITHUB_WORDS_URL)
    const docs = words.map((word) => ({ word }))

    // Limpa coleção antiga e faz a inserção em lotes (bulk)
    await db.collection(COLLECTION).deleteMany({})
    console.log(`Inserting ${docs.length} words...`)
    for (let i = 0; i < docs.length; i += 10000) {
      await db.collection(COLLECTION).insertMany(docs.slice(i, i + 10000))
      console.log(
        `Inserted ${Math.min(i + 10000, docs.length)} of ${docs.length}`
      )
    }

    console.log('Dictionary population finalized!')
  } catch (error) {
    console.error('Error feeding dictionary:', error)
  } finally {
    await disconnectMongo()
  }
}
