import { Request, Response } from 'express'
import { INGREDIENT_MESSAGE } from '~/constants/messages'
import ingredientServices from '~/services/userServices/ingredient.services'

export const getAllCategoryIngredientsController = async (req: Request, res: Response) => {
  const result = await ingredientServices.getAllCategoryIngredientsService()
  return res.json({
    result,
    message: INGREDIENT_MESSAGE.GET_ALL_CATEGORY_INGREDIENTS_SUCCESS
  })
}

export const getListIngredientController = async (req: Request, res: Response) => {
  const { page, limit, search, ingredient_category_ID } = req.query
  const result = await ingredientServices.getListIngerdientService({
    page: Number(page),
    limit: Number(limit),
    search: search as string,
    ingredient_category_ID: ingredient_category_ID as string
  })

  return res.json({
    result,
    message: INGREDIENT_MESSAGE.GET_LIST_INGREDIENTS_SUCCESS
  })
}
