import { Router } from 'express'
import {
  completeDateMealItemController,
  createMealItemsController,
  createMealScheduleController,
  deleteDateMealItemController,
  deleteMealScheduleController,
  getDateMealItemController,
  getListDateMealItemController,
  getListMealScheduleController,
  getMealScheduleByIdController,
  updateMealScheduleController
} from '~/controllers/userControllers/mealSchedule.controller'

import { accessTokenValidator } from '~/middlewares/authUser.middleware'
import { createMealScheduleValidator, updateMealScheduleValidator } from '~/middlewares/mealSchedule.middleware'
import { wrapRequestHandler } from '~/utils/handler'

const mealSchedulesRouter = Router()

mealSchedulesRouter.post(
  '/',
  accessTokenValidator,
  createMealScheduleValidator,
  wrapRequestHandler(createMealScheduleController)
)
mealSchedulesRouter.get('/', accessTokenValidator, wrapRequestHandler(getListMealScheduleController))
mealSchedulesRouter.get('/:id', accessTokenValidator, wrapRequestHandler(getMealScheduleByIdController))
mealSchedulesRouter.put(
  '/:id',
  accessTokenValidator,
  updateMealScheduleValidator,
  wrapRequestHandler(updateMealScheduleController)
)

mealSchedulesRouter.post('/meal-items/create', accessTokenValidator, wrapRequestHandler(createMealItemsController))

mealSchedulesRouter.get('/meal-items/get', wrapRequestHandler(getListDateMealItemController))

mealSchedulesRouter.get('/meal-items/get-item', wrapRequestHandler(getDateMealItemController))

mealSchedulesRouter.post(
  '/meal-items/complete',
  accessTokenValidator,
  wrapRequestHandler(completeDateMealItemController)
)

mealSchedulesRouter.post('/meal-items/delete', accessTokenValidator, wrapRequestHandler(deleteDateMealItemController))

mealSchedulesRouter.delete('/:id', accessTokenValidator, wrapRequestHandler(deleteMealScheduleController))

export default mealSchedulesRouter
