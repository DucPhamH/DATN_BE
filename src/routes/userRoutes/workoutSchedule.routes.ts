import { Router } from 'express'
import {
  completeDateWorkoutItemController,
  createWorkoutItemController,
  createWorkoutScheduleController,
  deleteDateWorkoutItemController,
  getListDateWorkoutItemController,
  getListWorkoutScheduleController,
  getWorkoutScheduleByIdController
} from '~/controllers/userControllers/workoutSchedule.controller'
import { accessTokenValidator } from '~/middlewares/authUser.middleware'
import { limitAndPageValidator, workoutScheduleValidator } from '~/middlewares/workoutSchedule.middleware'
import { wrapRequestHandler } from '~/utils/handler'

const workoutScheduleRouter = Router()

workoutScheduleRouter.get(
  '/',
  accessTokenValidator,
  limitAndPageValidator,
  wrapRequestHandler(getListWorkoutScheduleController)
)
workoutScheduleRouter.post(
  '/',
  accessTokenValidator,
  workoutScheduleValidator,
  wrapRequestHandler(createWorkoutScheduleController)
)
workoutScheduleRouter.get('/:id', accessTokenValidator, wrapRequestHandler(getWorkoutScheduleByIdController))

workoutScheduleRouter.post(
  '/workout-items/create',
  accessTokenValidator,
  wrapRequestHandler(createWorkoutItemController)
)

workoutScheduleRouter.get('/workout-items/get', wrapRequestHandler(getListDateWorkoutItemController))

workoutScheduleRouter.post('/workout-items/complete', wrapRequestHandler(completeDateWorkoutItemController))

workoutScheduleRouter.post('/workout-items/delete', wrapRequestHandler(deleteDateWorkoutItemController))
export default workoutScheduleRouter
