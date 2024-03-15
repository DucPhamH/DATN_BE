import { Router } from 'express'
import {
  loginController,
  logoutController,
  refreshTokenController,
  registerController
} from '~/controllers/authUser.controller'
import {
  accessTokenValidator,
  loginValidator,
  refreshTokenValidator,
  registerValidator
} from '~/middlewares/authUser.middleware'
import { wrapRequestHandler } from '~/utils/handler'

const authUserRouter = Router()

authUserRouter.post('/login', loginValidator, wrapRequestHandler(loginController))
authUserRouter.post('/register', registerValidator, wrapRequestHandler(registerController))
authUserRouter.post('/logout', accessTokenValidator, refreshTokenValidator, wrapRequestHandler(logoutController))
authUserRouter.post('/refresh-token', refreshTokenValidator, wrapRequestHandler(refreshTokenController))

export default authUserRouter
