import { Request, Response } from 'express'

import { AppError } from '@error/appError'
import { EntriesService } from '../services/entries.service'

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

  async getEntryByWord(req: Request, res: Response) {
    const { word } = req.params
    if (!word) throw new AppError('Word not provided.')

    const data = await this.service.getExternalWordData({
      userId: req.userid,
      word
    })

    res.json(data)
  }

  async setFavorite(req: Request, res: Response) {
    const { word } = req.params
    if (!word) throw new AppError('Word not provided.')

    await this.service.setFavorite({ userId: req.userid, word })
    res.status(201).send()
  }
}
