import { Request, Response } from 'express'

export class EntriesController {
  constructor() {}

  async getDictionary(req: Request, res: Response) {
    const search = req.query.search as string | undefined
    const limit = parseInt(req.query.limit as string) || 10

    res.json({ search, limit })
  }
}
