import { Router } from 'express'
import { createUserController, getUsersController } from '~/controllers/user.controller'
const usersRouter = Router()

usersRouter.post('/', createUserController)

usersRouter.get('/', getUsersController)

export default usersRouter
