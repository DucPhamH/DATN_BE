import { Router } from 'express'
import { UserRoles } from '~/constants/enums'
import {
  acceptRequestUpgradeController,
  banUserByIdController,
  createWritterAndInspectorController,
  dashboardController,
  deleteUserByIdController,
  getAllUserController,
  getRequestUpgradeController,
  getUserByIdController,
  rejectRequestUpgradeController,
  unbanUserByIdController
} from '~/controllers/adminControllers/userAdmin.controller'
import { accessTokenValidator } from '~/middlewares/authUser.middleware'
import { checkRole } from '~/middlewares/roles.middleware'
import { createWritterAndInspectorValidator } from '~/middlewares/userAdmin.middleware'
import { wrapRequestHandler } from '~/utils/handler'

const userAdminRouter = Router()

userAdminRouter.get(
  '/',
  accessTokenValidator,
  wrapRequestHandler(checkRole([UserRoles.admin])),
  wrapRequestHandler(getAllUserController)
)

userAdminRouter.get(
  '/:id',
  accessTokenValidator,
  wrapRequestHandler(checkRole([UserRoles.admin])),
  wrapRequestHandler(getUserByIdController)
)

userAdminRouter.delete(
  '/:id',
  accessTokenValidator,
  wrapRequestHandler(checkRole([UserRoles.admin])),
  wrapRequestHandler(deleteUserByIdController)
)

userAdminRouter.put(
  '/ban',
  accessTokenValidator,
  wrapRequestHandler(checkRole([UserRoles.admin])),
  wrapRequestHandler(banUserByIdController)
)

userAdminRouter.put(
  '/unban',
  accessTokenValidator,
  wrapRequestHandler(checkRole([UserRoles.admin])),
  wrapRequestHandler(unbanUserByIdController)
)

userAdminRouter.post(
  '/create-user',
  accessTokenValidator,
  wrapRequestHandler(checkRole([UserRoles.admin])),
  createWritterAndInspectorValidator,
  wrapRequestHandler(createWritterAndInspectorController)
)

userAdminRouter.get(
  '/request/upgrade-to-chef',
  accessTokenValidator,
  wrapRequestHandler(checkRole([UserRoles.admin])),
  wrapRequestHandler(getRequestUpgradeController)
)

userAdminRouter.put(
  '/request/reject-upgrade-to-chef',
  accessTokenValidator,
  wrapRequestHandler(checkRole([UserRoles.admin])),
  wrapRequestHandler(rejectRequestUpgradeController)
)

userAdminRouter.put(
  '/request/accept-upgrade-to-chef',
  accessTokenValidator,
  wrapRequestHandler(checkRole([UserRoles.admin])),
  wrapRequestHandler(acceptRequestUpgradeController)
)

userAdminRouter.get(
  '/home/dashboard',
  accessTokenValidator,
  wrapRequestHandler(checkRole([UserRoles.admin])),
  wrapRequestHandler(dashboardController)
)

export default userAdminRouter
