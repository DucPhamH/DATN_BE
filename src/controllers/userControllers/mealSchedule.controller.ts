import { Request, Response } from 'express'
import { MEAL_MESSAGE } from '~/constants/messages'
import { TokenPayload } from '~/models/requests/authUser.request'
import mealScheduleServices from '~/services/userServices/mealSchedule.services'

export const createMealScheduleController = async (req: Request, res: Response) => {
  const { name, weight_target, purpose, start_date, end_date } = req.body
  const user = req.decoded_authorization as TokenPayload

  const result = await mealScheduleServices.createMealScheduleService({
    user_id: user.user_id,
    name,
    weight_target: Number(weight_target),
    purpose: Number(purpose),
    start_date: new Date(start_date),
    end_date: new Date(end_date)
  })

  return res.json({
    result,
    message: MEAL_MESSAGE.CREATE_MEAL_SCHEDULE_SUCCESS
  })
}

export const getListMealScheduleController = async (req: Request, res: Response) => {
  const { page, limit } = req.query
  const user = req.decoded_authorization as TokenPayload
  const result = await mealScheduleServices.getListMealScheduleService({
    page: Number(page),
    limit: Number(limit),
    user_id: user.user_id
  })

  return res.json({
    result,
    message: MEAL_MESSAGE.GET_LIST_MEAL_SCHEDULE_SUCCESS
  })
}

export const getMealScheduleByIdController = async (req: Request, res: Response) => {
  const { id } = req.params
  const user = req.decoded_authorization as TokenPayload
  const result = await mealScheduleServices.getMealScheduleByIdService({
    id,
    user_id: user.user_id
  })

  return res.json({
    result,
    message: MEAL_MESSAGE.GET_MEAL_SCHEDULE_SUCCESS
  })
}

export const updateMealScheduleController = async (req: Request, res: Response) => {
  const { id } = req.params
  const { name, weight_target, purpose, end_date } = req.body
  const user = req.decoded_authorization as TokenPayload
  const result = await mealScheduleServices.updateMealScheduleService({
    user_id: user.user_id,
    id,
    name,
    weight_target: Number(weight_target),
    purpose: Number(purpose),
    end_date: new Date(end_date)
  })

  return res.json({
    result,
    message: MEAL_MESSAGE.UPDATE_MEAL_SCHEDULE_SUCCESS
  })
}

export const createMealItemsController = async (req: Request, res: Response) => {
  const arrayMealItems = req.body
  console.log(arrayMealItems)
  const user = req.decoded_authorization as TokenPayload
  const result = await mealScheduleServices.createMealScheduleItemService({
    arrayMealItems: arrayMealItems.map(
      (item: {
        meal_schedule_id: string
        meal_name: string
        quantity: number
        unit: string
        energy: number
        protein: number
        fat: number
        carb: number
        current_date: Date
      }) => ({
        ...item,
        current_date: new Date(item.current_date)
      })
    )
  })

  return res.json({
    result,
    message: MEAL_MESSAGE.CREATE_MEAL_ITEM_SUCCESS
  })
}

export const getListDateMealItemController = async (req: Request, res: Response) => {
  const { page, limit, meal_schedule_id } = req.query
  const result = await mealScheduleServices.getListDateMealItemService({
    meal_schedule_id: meal_schedule_id as string,
    page: Number(page),
    limit: Number(limit)
  })

  return res.json({
    result,
    message: MEAL_MESSAGE.GET_LIST_DATE_MEAL_ITEM_SUCCESS
  })
}

export const completeDateMealItemController = async (req: Request, res: Response) => {
  const { meal_schedule_id, date } = req.body

  const result = await mealScheduleServices.compeleteDateMealItemService({
    meal_schedule_id: meal_schedule_id as string,
    date: date
  })
  return res.json({
    result,
    message: MEAL_MESSAGE.COMPLETE_DATE_MEAL_ITEM_SUCCESS
  })
}

export const deleteDateMealItemController = async (req: Request, res: Response) => {
  const { meal_schedule_id, date, is_completed } = req.body

  const result = await mealScheduleServices.deleteDateMealItemService({
    meal_schedule_id: meal_schedule_id as string,
    date: date,
    is_completed: is_completed as string
  })
  return res.json({
    result,
    message: MEAL_MESSAGE.DELETE_DATE_MEAL_ITEM_SUCCESS
  })
}

export const deleteMealScheduleController = async (req: Request, res: Response) => {
  const { id } = req.params
  const user = req.decoded_authorization as TokenPayload

  const result = await mealScheduleServices.deleteMealScheduleService({
    id,
    user_id: user.user_id
  })

  return res.json({
    result,
    message: MEAL_MESSAGE.DELETE_MEAL_SCHEDULE_SUCCESS
  })
}

export const getDateMealItemController = async (req: Request, res: Response) => {
  const { meal_schedule_id, date } = req.query
  const result = await mealScheduleServices.getDateMealItemService({
    meal_schedule_id: meal_schedule_id as string,
    date: date as string
  })

  return res.json({
    result,
    message: MEAL_MESSAGE.GET_LIST_DATE_MEAL_ITEM_SUCCESS
  })
}
