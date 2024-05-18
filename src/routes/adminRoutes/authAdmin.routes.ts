import { Router } from 'express'
import {
  getMeAdminController,
  loginAdminController,
  logoutAdminController
} from '~/controllers/adminControllers/authAdmin.controller'
import { loginAdminValidator } from '~/middlewares/authAdmin.middleware'
import { accessTokenValidator } from '~/middlewares/authUser.middleware'
import { wrapRequestHandler } from '~/utils/handler'

const authAdminRouter = Router()

authAdminRouter.post('/login', loginAdminValidator, wrapRequestHandler(loginAdminController))
authAdminRouter.post('/logout', accessTokenValidator, wrapRequestHandler(logoutAdminController))
authAdminRouter.get('/me', accessTokenValidator, wrapRequestHandler(getMeAdminController))
export default authAdminRouter
