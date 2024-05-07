import { Router } from 'express'
import { getListActivityController } from '~/controllers/userControllers/activity.controller'
import { getListActivityValidator } from '~/middlewares/activity.middleware'
import { wrapRequestHandler } from '~/utils/handler'

const activitiesRouter = Router()

activitiesRouter.get('/', getListActivityValidator, wrapRequestHandler(getListActivityController))

export default activitiesRouter
