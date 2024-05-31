import { Router } from 'express'
import { UserRoles } from '~/constants/enums'
import {
  bookmarkRecipeController,
  createCommentRecipeController,
  createRecipeForChefController,
  deleteCommentRecipeController,
  deleteRecipeForChefController,
  getAllRecipeCategoryController,
  getCommentRecipeController,
  getListMeRecipesController,
  getListRecipesForChefController,
  getListRecipesForUserController,
  getListUserRecipesController,
  getRecicpeForChefController,
  getRecipeForUserController,
  getThreeTopRecipesController,
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

recipesRouter.post('/actions/like', accessTokenValidator, wrapRequestHandler(likeRecipeController))
recipesRouter.post('/actions/unlike', accessTokenValidator, wrapRequestHandler(unlikeRecipeController))

recipesRouter.post('/actions/comment', accessTokenValidator, wrapRequestHandler(createCommentRecipeController))
recipesRouter.get('/actions/comment', accessTokenValidator, wrapRequestHandler(getCommentRecipeController))
recipesRouter.post('/actions/delete-comment', accessTokenValidator, wrapRequestHandler(deleteCommentRecipeController))

recipesRouter.post('/actions/bookmark', accessTokenValidator, wrapRequestHandler(bookmarkRecipeController))
recipesRouter.post('/actions/unbookmark', accessTokenValidator, wrapRequestHandler(unbookmarkRecipeController))

recipesRouter.post(
  '/',
  accessTokenValidator,
  wrapRequestHandler(checkRole([UserRoles.chef])),
  upload.single('image'),
  wrapRequestHandler(createRecipeValidator()),
  wrapRequestHandler(createRecipeForChefController)
)

recipesRouter.get(
  '/chef/get-recipes',
  accessTokenValidator,
  getListRecipeForChefValidator,
  wrapRequestHandler(checkRole([UserRoles.chef])),
  wrapRequestHandler(getListRecipesForChefController)
)

recipesRouter.get(
  '/chef/get-recipe/:id',
  accessTokenValidator,
  wrapRequestHandler(checkRole([UserRoles.chef])),
  wrapRequestHandler(getRecicpeForChefController)
)

recipesRouter.put(
  '/chef/update-recipe/:id',
  accessTokenValidator,
  upload.single('image'),
  wrapRequestHandler(checkRole([UserRoles.chef])),
  wrapRequestHandler(updateRecipeForChefController)
)

recipesRouter.delete(
  '/chef/delete-recipe/:id',
  accessTokenValidator,
  wrapRequestHandler(checkRole([UserRoles.chef])),
  wrapRequestHandler(deleteRecipeForChefController)
)

recipesRouter.get('/user/get-recipe/:id', accessTokenValidator, wrapRequestHandler(getRecipeForUserController))

recipesRouter.get(
  '/user/get-recipes',
  accessTokenValidator,
  getListRecipeForUserValidator,
  wrapRequestHandler(getListRecipesForUserController)
)

recipesRouter.get('/user/get-top-recipes', wrapRequestHandler(getThreeTopRecipesController))

recipesRouter.get('/me/get-list-recipe', accessTokenValidator, wrapRequestHandler(getListMeRecipesController))

recipesRouter.get('/user/get-list-recipe/:id', accessTokenValidator, wrapRequestHandler(getListUserRecipesController))

export default recipesRouter
