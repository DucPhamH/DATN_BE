import { Router } from 'express'
import {
  createWorkoutScheduleController,
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

export default workoutScheduleRouter
