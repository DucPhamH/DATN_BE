import { Router } from 'express'
import {
  getAllCategoryIngredientsController,
  getListIngredientController
} from '~/controllers/userControllers/ingredient.controller'
import { wrapRequestHandler } from '~/utils/handler'

const ingredientsRouter = Router()

ingredientsRouter.get('/category', wrapRequestHandler(getAllCategoryIngredientsController))

ingredientsRouter.get('/', wrapRequestHandler(getListIngredientController))

export default ingredientsRouter
