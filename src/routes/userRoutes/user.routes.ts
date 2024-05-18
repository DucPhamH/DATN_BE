import { Router } from 'express'
import {
  followUserController,
  getBookmarkedUserController,
  getMeController,
  getUserController,
  recommendUsersController,
  requestUpgradeToChefController,
  unfollowUserController,
  updateAvatarUserController,
  updateCoverAvatarUserController,
  updatePasswordUserController,
  updateUserController
} from '~/controllers/userControllers/user.controller'
import { accessTokenValidator } from '~/middlewares/authUser.middleware'
import {
  followValidator,
  requestUpgradeToChefValidator,
  updatePasswordValidator,
  updateProfileValidator
} from '~/middlewares/user.middleware'
import { wrapRequestHandler } from '~/utils/handler'
import upload from '~/utils/multer'
const usersRouter = Router()

usersRouter.get('/me', accessTokenValidator, wrapRequestHandler(getMeController))
usersRouter.get('/get-user/:id', accessTokenValidator, wrapRequestHandler(getUserController))
usersRouter.post('/follow', accessTokenValidator, followValidator, wrapRequestHandler(followUserController))
usersRouter.post('/unfollow', accessTokenValidator, followValidator, wrapRequestHandler(unfollowUserController))

usersRouter.put(
  '/update-avatar',
  accessTokenValidator,
  upload.single('image'),
  wrapRequestHandler(updateAvatarUserController)
)

usersRouter.put(
  '/update-cover-avatar',
  accessTokenValidator,
  upload.single('image'),
  wrapRequestHandler(updateCoverAvatarUserController)
)

usersRouter.put(
  '/update-password',
  accessTokenValidator,
  updatePasswordValidator,
  wrapRequestHandler(updatePasswordUserController)
)

usersRouter.put(
  '/update-profile',
  accessTokenValidator,
  updateProfileValidator,
  wrapRequestHandler(updateUserController)
)

usersRouter.get('/bookmarks', accessTokenValidator, wrapRequestHandler(getBookmarkedUserController))

usersRouter.get('/recommed', accessTokenValidator, wrapRequestHandler(recommendUsersController))

usersRouter.put(
  '/update-to-chef',
  accessTokenValidator,
  requestUpgradeToChefValidator,
  wrapRequestHandler(requestUpgradeToChefController)
)

export default usersRouter
