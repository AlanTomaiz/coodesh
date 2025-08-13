export function encodeCursor(id: string): string {
  return Buffer.from(JSON.stringify(id)).toString('base64')
}

export function decodeCursor(cursor: string): string | null {
  try {
    return JSON.parse(Buffer.from(cursor, 'base64').toString()) || null
  } catch {
    return null
  }
}
