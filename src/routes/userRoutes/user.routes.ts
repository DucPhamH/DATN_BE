import { Router } from 'express'
import {
  followUserController,
  getMeController,
  getUserController,
  unfollowUserController
} from '~/controllers/user.controller'
import { accessTokenValidator } from '~/middlewares/authUser.middleware'
import { followValidator } from '~/middlewares/user.middleware'
import { wrapRequestHandler } from '~/utils/handler'
const usersRouter = Router()

usersRouter.get('/me', accessTokenValidator, wrapRequestHandler(getMeController))
usersRouter.get('/get-user/:id', accessTokenValidator, wrapRequestHandler(getUserController))
usersRouter.post('/follow', accessTokenValidator, followValidator, wrapRequestHandler(followUserController))
usersRouter.post('/unfollow', accessTokenValidator, followValidator, wrapRequestHandler(unfollowUserController))

export default usersRouter
