import { Router } from 'express'
import { createUserController, getMeController, getUsersController } from '~/controllers/user.controller'
import { accessTokenValidator } from '~/middlewares/authUser.middleware'
import { wrapRequestHandler } from '~/utils/handler'
const usersRouter = Router()

usersRouter.post('/', createUserController)

usersRouter.get('/', getUsersController)

usersRouter.get('/me', accessTokenValidator, wrapRequestHandler(getMeController))

export default usersRouter
