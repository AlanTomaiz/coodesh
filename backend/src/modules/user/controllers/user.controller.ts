import { Request, Response } from 'express'

import { UserService } from '../services/user.service'

export class UserController {
  constructor(private readonly userService: UserService) {}

  async getProfile(req: Request, res: Response) {
    const profile = await this.userService.getProfile(req.userid)
    res.json(profile)
  }

  async indexHistory(req: Request, res: Response) {
    const limit = parseInt(req.query.limit as string) || 25
    const cursor = req.query.cursor as string | undefined
    const direction = (req.query.direction as 'next' | 'previous') || 'next'

    const data = await this.userService.listHistory({
      userId: req.userid,
      limit,
      cursor,
      direction
    })

    res.json(data)
  }

  async indexFavorites(req: Request, res: Response) {
    const limit = parseInt(req.query.limit as string) || 25
    const cursor = req.query.cursor as string | undefined
    const direction = (req.query.direction as 'next' | 'previous') || 'next'

    const data = await this.userService.listFavorites({
      userId: req.userid,
      limit,
      cursor,
      direction
    })

    res.json(data)
  }
}
