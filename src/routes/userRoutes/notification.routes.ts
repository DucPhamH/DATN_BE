import { Router } from 'express'
import {
  checkReadNotificationController,
  deleteNotificationController,
  getListNotificationController,
  readNotificationController
} from '~/controllers/userControllers/notification.controller'
import { accessTokenValidator } from '~/middlewares/authUser.middleware'

import { wrapRequestHandler } from '~/utils/handler'

const notificationsRouter = Router()

notificationsRouter.get('/', accessTokenValidator, wrapRequestHandler(getListNotificationController))

notificationsRouter.put('/read/:id', accessTokenValidator, wrapRequestHandler(readNotificationController))

notificationsRouter.delete('/delete/:id', accessTokenValidator, wrapRequestHandler(deleteNotificationController))

notificationsRouter.get('/check-read', accessTokenValidator, wrapRequestHandler(checkReadNotificationController))

export default notificationsRouter
