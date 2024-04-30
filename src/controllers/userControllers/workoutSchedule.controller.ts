import { Request, Response } from 'express'
import moment from 'moment'
import { WORKOUT_MESSAGE } from '~/constants/messages'
import { TokenPayload } from '~/models/requests/authUser.request'
import workoutScheduleService from '~/services/userServices/workoutSchedule.services'

export const createWorkoutScheduleController = async (req: Request, res: Response) => {
  const { name, weight, calo_target, start_date, end_date } = req.body
  const user = req.decoded_authorization as TokenPayload
  console.log(start_date, end_date)

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

export const updateWorkoutScheduleController = async (req: Request, res: Response) => {
  const { id } = req.params
  const { name, calo_target, end_date } = req.body
  const user = req.decoded_authorization as TokenPayload

  const result = await workoutScheduleService.updateWorkoutScheduleService({
    id,
    user_id: user.user_id,
    name,
    calo_target: Number(calo_target),
    end_date: new Date(end_date)
  })

  return res.json({
    result,
    message: WORKOUT_MESSAGE.UPDATE_WORKOUT_SUCCESS
  })
}

export const deleteWorkoutScheduleController = async (req: Request, res: Response) => {
  const { id } = req.params
  const user = req.decoded_authorization as TokenPayload

  const result = await workoutScheduleService.deleteWorkoutScheduleService({
    id,
    user_id: user.user_id
  })

  return res.json({
    result,
    message: WORKOUT_MESSAGE.DELETE_WORKOUT_SUCCESS
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

export const createWorkoutItemController = async (req: Request, res: Response) => {
  const arrayWorkoutItems = req.body
  console.log(arrayWorkoutItems)
  const user = req.decoded_authorization as TokenPayload
  const result = await workoutScheduleService.createWorkoutItemService({
    arrayWorkoutItems: arrayWorkoutItems.map(
      (item: {
        workout_schedule_id: string
        activity_name: string
        time: number
        met: number
        current_date: Date
      }) => ({
        ...item,
        current_date: new Date(item.current_date)
      })
    )
  })

  return res.json({
    result,
    message: WORKOUT_MESSAGE.CREATE_WORKOUT_ITEM_SUCCESS
  })
}

export const getListDateWorkoutItemController = async (req: Request, res: Response) => {
  const { page, limit, workout_schedule_id } = req.query
  const result = await workoutScheduleService.getListDateWorkoutItemService({
    workout_schedule_id: workout_schedule_id as string,
    page: Number(page),
    limit: Number(limit)
  })

  return res.json({
    result,
    message: WORKOUT_MESSAGE.GET_LIST_DATE_WORKOUT_ITEM_SUCCESS
  })
}

export const completeDateWorkoutItemController = async (req: Request, res: Response) => {
  const { workout_schedule_id, date } = req.body

  const result = await workoutScheduleService.completeDateWorkoutItemService({
    workout_schedule_id: workout_schedule_id as string,
    date: date
  })
  return res.json({
    result,
    message: WORKOUT_MESSAGE.COMPLETE_DATE_WORKOUT_ITEM_SUCCESS
  })
}

export const deleteDateWorkoutItemController = async (req: Request, res: Response) => {
  const { workout_schedule_id, date, is_completed } = req.body

  const result = await workoutScheduleService.deleteDateWorkoutItemService({
    workout_schedule_id: workout_schedule_id as string,
    date: date,
    is_completed: is_completed as string
  })
  return res.json({
    result,
    message: WORKOUT_MESSAGE.DELETE_DATE_WORKOUT_ITEM_SUCCESS
  })
}

export const weightSyncController = async (req: Request, res: Response) => {
  const { workout_schedule_id } = req.body
  const user = req.decoded_authorization as TokenPayload
  const result = await workoutScheduleService.weightSyncService({
    user_id: user.user_id,
    workout_schedule_id: workout_schedule_id as string
  })

  return res.json({
    result,
    message: WORKOUT_MESSAGE.WEIGHT_SYNC_SUCCESS
  })
}
