import { Router } from 'express'
import { UserRoles } from '~/constants/enums'
import {
  createIngredientController,
  createRecipeForWritterController,
  deleteIngredientController,
  deleteRecipeForWritterController,
  getListRecipesForWritterController,
  getRecipeDetailForWritterController,
  updateRecipeForWritterController
} from '~/controllers/adminControllers/writter.controller'
import { accessTokenValidator } from '~/middlewares/authUser.middleware'
import { checkRole } from '~/middlewares/roles.middleware'
import { createRecipeValidator } from '~/middlewares/writter.middleware'
import { wrapRequestHandler } from '~/utils/handler'
import upload from '~/utils/multer'

const writterRouter = Router()

writterRouter.post(
  '/create-ingredient',
  accessTokenValidator,
  wrapRequestHandler(checkRole([UserRoles.admin, UserRoles.writter, UserRoles.inspector])),
  wrapRequestHandler(createIngredientController)
)

writterRouter.delete(
  '/delete-ingredient/:id',
  accessTokenValidator,
  wrapRequestHandler(checkRole([UserRoles.admin, UserRoles.writter, UserRoles.inspector])),
  wrapRequestHandler(deleteIngredientController)
)

writterRouter.get(
  '/recipes',
  accessTokenValidator,
  wrapRequestHandler(checkRole([UserRoles.admin, UserRoles.writter, UserRoles.inspector])),
  wrapRequestHandler(getListRecipesForWritterController)
)

writterRouter.get(
  '/recipes/:id',
  accessTokenValidator,
  wrapRequestHandler(checkRole([UserRoles.admin, UserRoles.writter, UserRoles.inspector])),
  wrapRequestHandler(getRecipeDetailForWritterController)
)

writterRouter.post(
  '/recipes',
  accessTokenValidator,
  wrapRequestHandler(checkRole([UserRoles.admin, UserRoles.writter, UserRoles.inspector])),
  upload.single('image'),
  wrapRequestHandler(createRecipeValidator()),
  wrapRequestHandler(createRecipeForWritterController)
)

writterRouter.put(
  '/recipes/:id',
  accessTokenValidator,
  wrapRequestHandler(checkRole([UserRoles.admin, UserRoles.writter, UserRoles.inspector])),
  upload.single('image'),
  wrapRequestHandler(updateRecipeForWritterController)
)

writterRouter.delete(
  '/recipes/:id',
  accessTokenValidator,
  wrapRequestHandler(checkRole([UserRoles.admin, UserRoles.writter, UserRoles.inspector])),
  wrapRequestHandler(deleteRecipeForWritterController)
)

export default writterRouter
