import { Router } from 'express'
import {
  completeDateWorkoutItemController,
  createWorkoutItemController,
  createWorkoutScheduleController,
  deleteDateWorkoutItemController,
  deleteWorkoutScheduleController,
  getListDateWorkoutItemController,
  getListWorkoutScheduleController,
  getWorkoutScheduleByIdController,
  updateWorkoutScheduleController,
  weightSyncController
} from '~/controllers/userControllers/workoutSchedule.controller'
import { accessTokenValidator } from '~/middlewares/authUser.middleware'
import {
  limitAndPageValidator,
  updateWorkoutScheduleValidator,
  workoutScheduleValidator
} from '~/middlewares/workoutSchedule.middleware'
import { wrapRequestHandler } from '~/utils/handler'

const workoutScheduleRouter = Router()

workoutScheduleRouter.get(
  '/',
  accessTokenValidator,
  limitAndPageValidator,
  wrapRequestHandler(getListWorkoutScheduleController)
)
workoutScheduleRouter.put(
  '/:id',
  accessTokenValidator,
  updateWorkoutScheduleValidator,
  wrapRequestHandler(updateWorkoutScheduleController)
)

workoutScheduleRouter.get('/:id', accessTokenValidator, wrapRequestHandler(getWorkoutScheduleByIdController))

workoutScheduleRouter.delete('/:id', accessTokenValidator, wrapRequestHandler(deleteWorkoutScheduleController))

workoutScheduleRouter.post(
  '/',
  accessTokenValidator,
  workoutScheduleValidator,
  wrapRequestHandler(createWorkoutScheduleController)
)

workoutScheduleRouter.post(
  '/workout-items/create',
  accessTokenValidator,
  wrapRequestHandler(createWorkoutItemController)
)

workoutScheduleRouter.post('/sync-weight', accessTokenValidator, wrapRequestHandler(weightSyncController))

workoutScheduleRouter.get('/workout-items/get', wrapRequestHandler(getListDateWorkoutItemController))

workoutScheduleRouter.post('/workout-items/complete', wrapRequestHandler(completeDateWorkoutItemController))

workoutScheduleRouter.post('/workout-items/delete', wrapRequestHandler(deleteDateWorkoutItemController))
export default workoutScheduleRouter
