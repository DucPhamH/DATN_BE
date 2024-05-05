import { Router } from 'express'
import { UserRoles } from '~/constants/enums'
import {
  createRecipeForChefController,
  getAllRecipeCategoryController,
  getListRecipesForChefController,
  getRecicpeForChefController,
  updateRecipeForChefController
} from '~/controllers/userControllers/recipe.controller'
import { accessTokenValidator } from '~/middlewares/authUser.middleware'
import { createRecipeValidator, getListRecipeForChefValidator } from '~/middlewares/recipe.middleware'
import { checkRole } from '~/middlewares/roles.middleware'
import { wrapRequestHandler } from '~/utils/handler'
import upload from '~/utils/multer'

const recipesRouter = Router()

recipesRouter.get('/category/get-category', wrapRequestHandler(getAllRecipeCategoryController))

recipesRouter.post(
  '/',
  accessTokenValidator,
  upload.single('image'),
  wrapRequestHandler(createRecipeValidator()),
  wrapRequestHandler(createRecipeForChefController)
)

recipesRouter.get(
  '/chef/get-recipes',
  accessTokenValidator,
  getListRecipeForChefValidator,
  wrapRequestHandler(checkRole([UserRoles.user])),
  wrapRequestHandler(getListRecipesForChefController)
)

recipesRouter.get(
  '/chef/get-recipe/:id',
  accessTokenValidator,
  wrapRequestHandler(checkRole([UserRoles.user])),
  wrapRequestHandler(getRecicpeForChefController)
)

recipesRouter.put(
  '/chef/update-recipe/:id',
  accessTokenValidator,
  upload.single('image'),
  wrapRequestHandler(checkRole([UserRoles.user])),
  wrapRequestHandler(updateRecipeForChefController)
)

export default recipesRouter
