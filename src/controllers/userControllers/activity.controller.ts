import { Request, Response } from 'express'
import { ACTIVITY_MESSAGE } from '~/constants/messages'
import activityService from '~/services/userServices/activity.services'

export const getListActivityController = async (req: Request, res: Response) => {
  const { page, limit, search, activity_category } = req.query
  const result = await activityService.getListActivityService({
    page: Number(page),
    limit: Number(limit),
    search: search as string,
    activity_category: activity_category as string
  })
  return res.json({
    result,
    message: ACTIVITY_MESSAGE.GET_LIST_ACTIVITY_SUCCESS
  })
}
