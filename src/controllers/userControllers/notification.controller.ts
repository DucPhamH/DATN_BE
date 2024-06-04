import { Request, Response } from 'express'
import { NOTIFICATION_MESSAGE } from '~/constants/messages'
import { TokenPayload } from '~/models/requests/authUser.request'
import notificationService from '~/services/userServices/notification.services'

export const getListNotificationController = async (req: Request, res: Response) => {
  const { page, limit } = req.query
  const user = req.decoded_authorization as TokenPayload
  const result = await notificationService.getListNotificationService({
    user_id: user.user_id,
    page: Number(page),
    limit: Number(limit)
  })
  return res.json({
    result,
    message: NOTIFICATION_MESSAGE.GET_LIST_NOTIFICATION_SUCCESS
  })
}

export const readNotificationController = async (req: Request, res: Response) => {
  const { id } = req.params
  const user = req.decoded_authorization as TokenPayload
  const result = await notificationService.readNotificationService({
    user_id: user.user_id,
    notification_id: id
  })
  return res.json({
    result,
    message: NOTIFICATION_MESSAGE.READ_NOTIFICATION_SUCCESS
  })
}

export const deleteNotificationController = async (req: Request, res: Response) => {
  const { id } = req.params
  const user = req.decoded_authorization as TokenPayload
  const result = await notificationService.deleteNotificationService({
    user_id: user.user_id,
    notification_id: id
  })
  return res.json({
    result,
    message: NOTIFICATION_MESSAGE.DELETE_NOTIFICATION_SUCCESS
  })
}

export const checkReadNotificationController = async (req: Request, res: Response) => {
  const user = req.decoded_authorization as TokenPayload
  const result = await notificationService.checkReadNotificationService({
    user_id: user.user_id
  })
  return res.json({
    result,
    message: NOTIFICATION_MESSAGE.CHECK_READ_NOTIFICATION_SUCCESS
  })
}
