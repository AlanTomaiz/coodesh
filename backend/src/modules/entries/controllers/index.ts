import { Request, Response } from 'express'

import { EntriesService } from '../services/index.ts'

export class EntriesController {
  constructor(private readonly service: EntriesService) {}

  async getDictionary(req: Request, res: Response) {
    const search = req.query.search as string | undefined
    const limit = parseInt(req.query.limit as string) || 10
    const page = parseInt(req.query.page as string) || 1
    const data = await this.service.getDictionaryWords({ search, limit, page })

    res.json({
      results: data.results,
      totalDocs: data.totalDocs,
      totalPages: data.totalPages,
      hasNext: data.hasNext,
      hasPrev: data.hasPrev
    })
  }
}
