import { Router } from 'express'
import { UserRoles } from '~/constants/enums'
import {
  createIngredientController,
  createRecipeForWritterController,
  deleteIngredientController,
  getListRecipesForWritterController,
  getRecipeDetailForWritterController,
  updateRecipeForWritterController
} from '~/controllers/adminControllers/writter.controller'
import { accessTokenValidator } from '~/middlewares/authUser.middleware'
import { checkRole } from '~/middlewares/roles.middleware'
import { wrapRequestHandler } from '~/utils/handler'
import upload from '~/utils/multer'

const writterRouter = Router()

writterRouter.post(
  '/create-ingredient',
  accessTokenValidator,
  wrapRequestHandler(checkRole([UserRoles.admin, UserRoles.writter])),
  wrapRequestHandler(createIngredientController)
)

writterRouter.delete(
  '/delete-ingredient/:id',
  accessTokenValidator,
  wrapRequestHandler(checkRole([UserRoles.admin, UserRoles.writter])),
  wrapRequestHandler(deleteIngredientController)
)

writterRouter.get(
  '/recipes',
  accessTokenValidator,
  wrapRequestHandler(checkRole([UserRoles.admin, UserRoles.writter])),
  wrapRequestHandler(getListRecipesForWritterController)
)

writterRouter.get(
  '/recipes/:id',
  accessTokenValidator,
  wrapRequestHandler(checkRole([UserRoles.admin, UserRoles.writter])),
  wrapRequestHandler(getRecipeDetailForWritterController)
)

writterRouter.post(
  '/recipes',
  accessTokenValidator,
  wrapRequestHandler(checkRole([UserRoles.admin, UserRoles.writter])),
  upload.single('image'),
  wrapRequestHandler(createRecipeForWritterController)
)

writterRouter.put(
  '/recipes/:id',
  accessTokenValidator,
  wrapRequestHandler(checkRole([UserRoles.admin, UserRoles.writter])),
  upload.single('image'),
  wrapRequestHandler(updateRecipeForWritterController)
)

export default writterRouter
