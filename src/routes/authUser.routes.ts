import { Router } from 'express'
import { loginController, registerController } from '~/controllers/authUser.controller'
import { registerValidator } from '~/middlewares/authUser.middleware'
import { wrapRequestHandler } from '~/utils/handler'

const authUserRouter = Router()

authUserRouter.post('/login', wrapRequestHandler(loginController))
authUserRouter.post('/register', registerValidator, wrapRequestHandler(registerController))

export default authUserRouter
