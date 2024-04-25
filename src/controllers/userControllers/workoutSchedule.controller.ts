import { Request, Response } from 'express'
import { WORKOUT_MESSAGE } from '~/constants/messages'
import { TokenPayload } from '~/models/requests/authUser.request'
import workoutScheduleService from '~/services/userServices/workoutSchedule.services'

export const createWorkoutScheduleController = async (req: Request, res: Response) => {
  const { name, weight, calo_target, start_date, end_date } = req.body
  const user = req.decoded_authorization as TokenPayload

  const result = await workoutScheduleService.createWorkoutScheduleService({
    user_id: user.user_id,
    name,
    weight: Number(weight),
    calo_target: Number(calo_target),
    start_date: new Date(start_date),
    end_date: new Date(end_date)
  })

  return res.json({
    result,
    message: WORKOUT_MESSAGE.CREATE_WORKOUT_SUCCESS
  })
}

export const getListWorkoutScheduleController = async (req: Request, res: Response) => {
  const { page, limit } = req.query
  const user = req.decoded_authorization as TokenPayload

  const result = await workoutScheduleService.getListWorkoutScheduleService({
    page: Number(page),
    limit: Number(limit),
    user_id: user.user_id
  })

  return res.json({
    result,
    message: WORKOUT_MESSAGE.GET_LIST_WORKOUT_SUCCESS
  })
}

export const getWorkoutScheduleByIdController = async (req: Request, res: Response) => {
  const { id } = req.params
  const user = req.decoded_authorization as TokenPayload
  const result = await workoutScheduleService.getWorkoutScheduleByIdService({
    id,
    user_id: user.user_id
  })
  return res.json({
    result,
    message: WORKOUT_MESSAGE.GET_WORKOUT_SUCCESS
  })
}
