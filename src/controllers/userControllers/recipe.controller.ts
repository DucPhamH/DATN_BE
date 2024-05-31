import { Request, Response } from 'express'
import { DifficultLevel, ProcessingRecipe, RegionRecipe } from '~/constants/enums'
import HTTP_STATUS from '~/constants/httpStatus'
import { RECIPE_MESSAGE } from '~/constants/messages'
import { TokenPayload } from '~/models/requests/authUser.request'
import recipeService from '~/services/userServices/recipe.services'
import { ErrorWithStatus } from '~/utils/error'

export const getAllRecipeCategoryController = async (req: Request, res: Response) => {
  const result = await recipeService.getAllRecipeCategoryService()
  return res.json({
    result,
    message: RECIPE_MESSAGE.GET_ALL_RECIPE_CATEGORY_SUCCESS
  })
}

export const createRecipeForChefController = async (req: Request, res: Response) => {
  const file = req.file
  const { title, description, content, video, time, region, difficult_level, category_recipe_id, processing_food } =
    req.body

  const user = req.decoded_authorization as TokenPayload
  if (!file) {
    throw new ErrorWithStatus({
      message: RECIPE_MESSAGE.IMAGE_REQUIRED,
      status: HTTP_STATUS.BAD_REQUEST
    })
  }
  const result = await recipeService.createRecipeService({
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
    processing_food
  })

  return res.json({
    message: RECIPE_MESSAGE.CREATE_RECIPE_SUCCESS,
    result
  })
}

export const updateRecipeForChefController = async (req: Request, res: Response) => {
  const file = req.file
  const { title, description, content, video, time, region, difficult_level, category_recipe_id, processing_food } =
    req.body
  const { id } = req.params
  const user = req.decoded_authorization as TokenPayload
  const result = await recipeService.updateRecipeForChefService({
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
    processing_food
  })
  return res.json({
    result,
    message: RECIPE_MESSAGE.UPDATE_RECIPE_SUCCESS
  })
}

export const getListRecipesForChefController = async (req: Request, res: Response) => {
  const user = req.decoded_authorization as TokenPayload
  const {
    page,
    limit,
    sort,
    status,
    search,
    category_recipe_id,
    difficult_level,
    processing_food,
    region,
    interval_time
  } = req.query

  const result = await recipeService.getListRecipesForChefService({
    user_id: user.user_id,
    page: Number(page),
    limit: Number(limit),
    sort: sort as string,
    status: status as string,
    search: search as string,
    category_recipe_id: category_recipe_id as string,
    difficult_level: Number(difficult_level),
    processing_food: processing_food as string,
    region: Number(region),
    interval_time: Number(interval_time)
  })
  return res.json({
    result,
    message: RECIPE_MESSAGE.GET_LIST_RECIPE_FOR_CHEF_SUCCESS
  })
}

export const getListRecipesForUserController = async (req: Request, res: Response) => {
  const user = req.decoded_authorization as TokenPayload
  const {
    page,
    limit,
    sort,
    search,
    category_recipe_id,
    difficult_level,
    processing_food,
    region,
    interval_time,
    type
  } = req.query

  const result = await recipeService.getListRecipesForUserService({
    user_id: user.user_id,
    page: Number(page),
    limit: Number(limit),
    sort: sort as string,
    search: search as string,
    category_recipe_id: category_recipe_id as string,
    difficult_level: Number(difficult_level),
    processing_food: processing_food as string,
    region: Number(region),
    interval_time: Number(interval_time),
    type: Number(type)
  })
  return res.json({
    result,
    message: RECIPE_MESSAGE.GET_LIST_RECIPE_FOR_USER_SUCCESS
  })
}

export const getRecicpeForChefController = async (req: Request, res: Response) => {
  const { id } = req.params
  const user = req.decoded_authorization as TokenPayload
  const result = await recipeService.getRecipeForChefService({
    user_id: user.user_id,
    recipe_id: id
  })
  return res.json({
    result,
    message: RECIPE_MESSAGE.GET_RECIPE_FOR_CHEF_SUCCESS
  })
}

export const getRecipeForUserController = async (req: Request, res: Response) => {
  const { id } = req.params
  const user = req.decoded_authorization as TokenPayload
  const result = await recipeService.getRecipeForUserService({
    user_id: user.user_id,
    recipe_id: id
  })
  return res.json({
    result,
    message: RECIPE_MESSAGE.GET_RECIPE_FOR_USER_SUCCESS
  })
}

export const likeRecipeController = async (req: Request, res: Response) => {
  const { recipe_id } = req.body
  const user = req.decoded_authorization as TokenPayload
  const result = await recipeService.likeRecipeService({
    user_id: user.user_id,
    recipe_id
  })
  return res.json({
    result,
    message: RECIPE_MESSAGE.LIKE_RECIPE_SUCCESS
  })
}

export const unlikeRecipeController = async (req: Request, res: Response) => {
  const { recipe_id } = req.body
  const user = req.decoded_authorization as TokenPayload
  const result = await recipeService.unlikeRecipeService({
    user_id: user.user_id,
    recipe_id
  })
  return res.json({
    result,
    message: RECIPE_MESSAGE.LIKE_RECIPE_SUCCESS
  })
}

export const createCommentRecipeController = async (req: Request, res: Response) => {
  const { recipe_id, content } = req.body
  const user = req.decoded_authorization as TokenPayload
  const result = await recipeService.createCommentRecipeService({
    user_id: user.user_id,
    recipe_id,
    content
  })
  return res.json({
    result,
    message: RECIPE_MESSAGE.CREATE_COMMENT_RECIPE_SUCCESS
  })
}

export const deleteCommentRecipeController = async (req: Request, res: Response) => {
  const { comment_id } = req.body
  const user = req.decoded_authorization as TokenPayload
  const result = await recipeService.deleteCommentRecipeService({
    user_id: user.user_id,
    comment_id
  })
  return res.json({
    result,
    message: RECIPE_MESSAGE.DELETE_COMMENT_RECIPE_SUCCESS
  })
}

export const bookmarkRecipeController = async (req: Request, res: Response) => {
  const { recipe_id } = req.body
  const user = req.decoded_authorization as TokenPayload
  const result = await recipeService.bookmarkRecipeService({
    user_id: user.user_id,
    recipe_id
  })
  return res.json({
    result,
    message: RECIPE_MESSAGE.BOOKMARK_RECIPE_SUCCESS
  })
}

export const unbookmarkRecipeController = async (req: Request, res: Response) => {
  const { recipe_id } = req.body
  const user = req.decoded_authorization as TokenPayload
  const result = await recipeService.unbookmarkRecipeService({
    user_id: user.user_id,
    recipe_id
  })
  return res.json({
    result,
    message: RECIPE_MESSAGE.UNBOOKMARK_RECIPE_SUCCESS
  })
}

export const getCommentRecipeController = async (req: Request, res: Response) => {
  const { recipe_id, page, limit } = req.query
  const result = await recipeService.getCommentRecipeService({
    recipe_id: recipe_id as string,
    page: Number(page),
    limit: Number(limit)
  })
  return res.json({
    result,
    message: RECIPE_MESSAGE.GET_COMMENT_RECIPE_SUCCESS
  })
}

export const deleteRecipeForChefController = async (req: Request, res: Response) => {
  const { id } = req.params
  const user = req.decoded_authorization as TokenPayload
  const result = await recipeService.deteleRecipeForChefService({
    user_id: user.user_id,
    recipe_id: id
  })
  return res.json({
    result,
    message: RECIPE_MESSAGE.DELETE_RECIPE_SUCCESS
  })
}

export const getThreeTopRecipesController = async (req: Request, res: Response) => {
  const result = await recipeService.getThreeTopRecipesService()
  return res.json({
    result,
    message: RECIPE_MESSAGE.GET_THREE_TOP_RECIPES_SUCCESS
  })
}

export const getListMeRecipesController = async (req: Request, res: Response) => {
  const user = req.decoded_authorization as TokenPayload
  const { page, limit } = req.query
  const result = await recipeService.getListMeRecipeService({
    user_id: user.user_id,
    page: Number(page),
    limit: Number(limit)
  })
  return res.json({
    result,
    message: RECIPE_MESSAGE.GET_LIST_RECIPE_FOR_CHEF_SUCCESS
  })
}

export const getListUserRecipesController = async (req: Request, res: Response) => {
  const { id } = req.params
  const { page, limit } = req.query
  const user = req.decoded_authorization as TokenPayload
  const result = await recipeService.getListUserRecipeService({
    id: id as string,
    user_id: user.user_id,
    page: Number(page),
    limit: Number(limit)
  })
  return res.json({
    result,
    message: RECIPE_MESSAGE.GET_LIST_RECIPE_FOR_USER_SUCCESS
  })
}
