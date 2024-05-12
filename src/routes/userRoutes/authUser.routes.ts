import { Router } from 'express'
import {
  loginAdminController,
  loginController,
  logoutController,
  oauthController,
  refreshTokenController,
  registerController,
  resetPasswordController,
  sendOtpController,
  verifyOtpController
} from '~/controllers/userControllers/authUser.controller'
import {
  accessTokenValidator,
  loginAdminValidator,
  loginValidator,
  refreshTokenValidator,
  registerValidator,
  resetPasswordValidator,
  verifyOtpValidator
} from '~/middlewares/authUser.middleware'
import { wrapRequestHandler } from '~/utils/handler'

const authUserRouter = Router()

authUserRouter.post('/login', loginValidator, wrapRequestHandler(loginController))
authUserRouter.post('/login/admin', loginAdminValidator, wrapRequestHandler(loginAdminController))
authUserRouter.post('/register', registerValidator, wrapRequestHandler(registerController))
authUserRouter.post('/logout', accessTokenValidator, refreshTokenValidator, wrapRequestHandler(logoutController))
authUserRouter.post('/refresh-token', refreshTokenValidator, wrapRequestHandler(refreshTokenController))
authUserRouter.get('/oauth/google', wrapRequestHandler(oauthController))
authUserRouter.post('/send-otp', wrapRequestHandler(sendOtpController))
authUserRouter.post('/verify-otp', verifyOtpValidator, wrapRequestHandler(verifyOtpController))
authUserRouter.post('/reset-password', resetPasswordValidator, wrapRequestHandler(resetPasswordController))

export default authUserRouter
