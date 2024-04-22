import { Request, Response } from 'express'
import { ACTIVITY_MESSAGE } from '~/constants/messages'
import activityService from '~/services/userServices/activity.services'

export const getListActivityCategoryController = async (req: Request, res: Response) => {
  const result = await activityService.getListActivityCategoryService()
  return res.json({
    result,
    message: ACTIVITY_MESSAGE.GET_LIST_ACTIVITY_CATEGORY_SUCCESS
  })
}

export const getListActivityController = async (req: Request, res: Response) => {
  const { page, limit, search, activity_category_id } = req.query
  const result = await activityService.getListActivityService({
    page: Number(page),
    limit: Number(limit),
    search: search as string,
    activity_category_id: activity_category_id as string
  })
  return res.json({
    result,
    message: ACTIVITY_MESSAGE.GET_LIST_ACTIVITY_SUCCESS
  })
}
