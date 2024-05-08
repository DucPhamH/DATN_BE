import { Router } from 'express'
import { UserRoles } from '~/constants/enums'
import {
  bookmarkRecipeController,
  createCommentRecipeController,
  createRecipeForChefController,
  deleteCommentRecipeController,
  getAllRecipeCategoryController,
  getCommentRecipeController,
  getListRecipesForChefController,
  getListRecipesForUserController,
  getRecicpeForChefController,
  getRecipeForUserController,
  likeRecipeController,
  unbookmarkRecipeController,
  unlikeRecipeController,
  updateRecipeForChefController
} from '~/controllers/userControllers/recipe.controller'
import { accessTokenValidator } from '~/middlewares/authUser.middleware'
import {
  createRecipeValidator,
  getListRecipeForChefValidator,
  getListRecipeForUserValidator
} from '~/middlewares/recipe.middleware'
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

recipesRouter.post('/actions/like', accessTokenValidator, wrapRequestHandler(likeRecipeController))
recipesRouter.post('/actions/unlike', accessTokenValidator, wrapRequestHandler(unlikeRecipeController))

recipesRouter.post('/actions/comment', accessTokenValidator, wrapRequestHandler(createCommentRecipeController))
recipesRouter.get('/actions/comment', accessTokenValidator, wrapRequestHandler(getCommentRecipeController))
recipesRouter.post('/actions/delete-comment', accessTokenValidator, wrapRequestHandler(deleteCommentRecipeController))

recipesRouter.post('/actions/bookmark', accessTokenValidator, wrapRequestHandler(bookmarkRecipeController))
recipesRouter.post('/actions/unbookmark', accessTokenValidator, wrapRequestHandler(unbookmarkRecipeController))

recipesRouter.get(
  '/chef/get-recipes',
  accessTokenValidator,
  getListRecipeForChefValidator,
  wrapRequestHandler(checkRole([UserRoles.user])),
  wrapRequestHandler(getListRecipesForChefController)
)

recipesRouter.get(
  '/user/get-recipes',
  accessTokenValidator,
  getListRecipeForUserValidator,
  wrapRequestHandler(checkRole([UserRoles.user])),
  wrapRequestHandler(getListRecipesForUserController)
)

recipesRouter.get(
  '/chef/get-recipe/:id',
  accessTokenValidator,
  wrapRequestHandler(checkRole([UserRoles.user])),
  wrapRequestHandler(getRecicpeForChefController)
)

recipesRouter.get(
  '/user/get-recipe/:id',
  accessTokenValidator,
  wrapRequestHandler(checkRole([UserRoles.user])),
  wrapRequestHandler(getRecipeForUserController)
)

recipesRouter.put(
  '/chef/update-recipe/:id',
  accessTokenValidator,
  upload.single('image'),
  wrapRequestHandler(checkRole([UserRoles.user])),
  wrapRequestHandler(updateRecipeForChefController)
)

export default recipesRouter
