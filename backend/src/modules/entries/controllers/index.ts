import { Request, Response } from 'express'

import { AppError } from '@error/appError'
import { EntriesService } from '../services/entries.service'

export class EntriesController {
  constructor(private readonly service: EntriesService) {}

  async getDictionary(req: Request, res: Response) {
    const search = req.query.search as string | undefined
    const limit = parseInt(req.query.limit as string) || 25
    const cursor = req.query.cursor as string | undefined
    const direction = (req.query.direction as 'next' | 'previous') || 'next'

    const data = await this.service.getDictionaryWords({
      search,
      limit,
      cursor,
      direction
    })

    res.json(data)
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

  async removeFavorite(req: Request, res: Response) {
    const { word } = req.params
    if (!word) throw new AppError('Word not provided.')

    await this.service.removeFavorite({ userId: req.userid, word })
    res.send()
  }
}
