import { Request, Response } from 'express'
import HTTP_STATUS from '~/constants/httpStatus'
import { RECIPE_MESSAGE, WRITTER_MESSAGE } from '~/constants/messages'
import { TokenPayload } from '~/models/requests/authUser.request'
import writterService from '~/services/adminServices/writter.services'
import { ErrorWithStatus } from '~/utils/error'

export const createIngredientController = async (req: Request, res: Response) => {
  const { name, energy, protein, fat, carbohydrate, ingredient_category_ID } = req.body
  const result = await writterService.createIngredientService({
    name: name as string,
    energy: Number(energy),
    protein: Number(protein),
    fat: Number(fat),
    carbohydrate: Number(carbohydrate),
    ingredient_category_ID: ingredient_category_ID as string
  })

  return res.json({
    result,
    message: WRITTER_MESSAGE.CREATE_INGREDIENT_SUCCESS
  })
}

export const deleteIngredientController = async (req: Request, res: Response) => {
  const { id } = req.params
  const result = await writterService.deleteIngredientService({ ingredient_id: id })
  return res.json({
    result,
    message: WRITTER_MESSAGE.DELETE_INGREDIENT_SUCCESS
  })
}

export const getListRecipesForWritterController = async (req: Request, res: Response) => {
  const user = req.decoded_authorization as TokenPayload
  const { page, limit, sort, search, category_recipe_id, difficult_level, processing_food, region, interval_time } =
    req.query

  const result = await writterService.getListRecipesForWritterService({
    user_id: user.user_id,
    page: Number(page),
    limit: Number(limit),
    sort: sort as string,
    search: search as string,
    category_recipe_id: category_recipe_id as string,
    difficult_level: Number(difficult_level),
    processing_food: processing_food as string,
    region: Number(region),
    interval_time: Number(interval_time)
  })
  return res.json({
    result,
    message: WRITTER_MESSAGE.GET_LIST_RECIPE_FOR_WRITTER_SUCCESS
  })
}

export const getRecipeDetailForWritterController = async (req: Request, res: Response) => {
  const { id } = req.params
  const user = req.decoded_authorization as TokenPayload
  const result = await writterService.getRecipeForWritterService({
    user_id: user.user_id,
    recipe_id: id
  })
  return res.json({
    result,
    message: WRITTER_MESSAGE.GET_RECIPE_DETAIL_FOR_WRITTER_SUCCESS
  })
}

export const createRecipeForWritterController = async (req: Request, res: Response) => {
  const file = req.file
  const {
    title,
    description,
    content,
    video,
    time,
    region,
    difficult_level,
    category_recipe_id,
    processing_food,
    energy,
    protein,
    fat,
    carbohydrate,
    unit,
    quantity,
    ingredients
  } = req.body

  const user = req.decoded_authorization as TokenPayload
  if (!file) {
    throw new ErrorWithStatus({
      message: RECIPE_MESSAGE.IMAGE_REQUIRED,
      status: HTTP_STATUS.BAD_REQUEST
    })
  }
  const result = await writterService.createRecipeForWritterService({
    user_id: user.user_id,
    title,
    description,
    content,
    image: file,
    video,
    time: Number(time),
    region: Number(region),
    difficult_level: Number(difficult_level),
    category_recipe_id,
    processing_food,
    energy: Number(energy),
    protein: Number(protein),
    fat: Number(fat),
    carbohydrate: Number(carbohydrate),
    unit,
    quantity: Number(quantity),
    ingredients: JSON.parse(ingredients as string)
  })

  return res.json({
    message: RECIPE_MESSAGE.CREATE_RECIPE_SUCCESS,
    result
  })
}

export const updateRecipeForWritterController = async (req: Request, res: Response) => {
  const file = req.file
  const {
    title,
    description,
    content,
    video,
    time,
    region,
    difficult_level,
    category_recipe_id,
    processing_food,
    energy,
    protein,
    fat,
    carbohydrate,
    unit,
    quantity,
    ingredients
  } = req.body
  const { id } = req.params
  const user = req.decoded_authorization as TokenPayload
  const result = await writterService.updateRecipeForWritterService({
    user_id: user.user_id,
    recipe_id: id,
    title,
    description,
    content,
    image: file,
    video,
    time: Number(time),
    region: Number(region),
    difficult_level: Number(difficult_level),
    category_recipe_id,
    processing_food,
    energy: Number(energy),
    protein: Number(protein),
    fat: Number(fat),
    carbohydrate: Number(carbohydrate),
    unit,
    quantity: Number(quantity),
    ingredients: JSON.parse(ingredients as string)
  })
  return res.json({
    result,
    message: RECIPE_MESSAGE.UPDATE_RECIPE_SUCCESS
  })
}

export const deleteRecipeForWritterController = async (req: Request, res: Response) => {
  const { id } = req.params
  const user = req.decoded_authorization as TokenPayload
  const result = await writterService.deteleRecipeForWritterService({
    user_id: user.user_id,
    recipe_id: id
  })
  return res.json({
    result,
    message: RECIPE_MESSAGE.DELETE_RECIPE_SUCCESS
  })
}
