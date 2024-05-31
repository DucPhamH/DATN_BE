import { Router } from 'express'
import { UserRoles } from '~/constants/enums'
import {
  bookmarkAlbumController,
  createAlbumController,
  deleteAlbumForChefController,
  deleteRecipeInAlbumForChefController,
  getAlbumForChefController,
  getAlbumForUserController,
  getListAlbumForChefController,
  getListAlbumForUserController,
  getListMeAlbumController,
  getListUserAlbumController,
  getRecipesInAlbumController,
  unBookmarkAlbumController,
  updateAlbumForChefController
} from '~/controllers/userControllers/album.controller'
import { createAlbumValidator, getListAlbumForChefValidator } from '~/middlewares/album.middleware'
import { accessTokenValidator } from '~/middlewares/authUser.middleware'
import { checkRole } from '~/middlewares/roles.middleware'
import { wrapRequestHandler } from '~/utils/handler'

const albumsRouter = Router()

albumsRouter.post(
  '/',
  accessTokenValidator,
  wrapRequestHandler(checkRole([UserRoles.chef])),
  createAlbumValidator,
  wrapRequestHandler(createAlbumController)
)

albumsRouter.get(
  '/chef/get-albums',
  accessTokenValidator,
  wrapRequestHandler(checkRole([UserRoles.chef])),
  getListAlbumForChefValidator,
  wrapRequestHandler(getListAlbumForChefController)
)

albumsRouter.post(
  '/chef/delete-recipe-in-album',
  accessTokenValidator,
  wrapRequestHandler(checkRole([UserRoles.chef])),
  wrapRequestHandler(deleteRecipeInAlbumForChefController)
)

albumsRouter.put(
  '/chef/update-album/:id',
  accessTokenValidator,
  wrapRequestHandler(checkRole([UserRoles.chef])),
  createAlbumValidator,
  wrapRequestHandler(updateAlbumForChefController)
)

albumsRouter.delete(
  '/chef/delete-album/:id',
  accessTokenValidator,
  wrapRequestHandler(checkRole([UserRoles.chef])),
  wrapRequestHandler(deleteAlbumForChefController)
)

albumsRouter.get(
  '/chef/get-album/:id',
  accessTokenValidator,
  wrapRequestHandler(checkRole([UserRoles.chef])),
  wrapRequestHandler(getAlbumForChefController)
)

albumsRouter.get('/user/get-albums', getListAlbumForChefValidator, wrapRequestHandler(getListAlbumForUserController))

albumsRouter.get('/user/get-album/:id', accessTokenValidator, wrapRequestHandler(getAlbumForUserController))
albumsRouter.get('/user/get-recipes-in-album', accessTokenValidator, wrapRequestHandler(getRecipesInAlbumController))

albumsRouter.post('/actions/bookmark', accessTokenValidator, wrapRequestHandler(bookmarkAlbumController))
albumsRouter.post('/actions/unbookmark', accessTokenValidator, wrapRequestHandler(unBookmarkAlbumController))

albumsRouter.get('/me/get-list-album', accessTokenValidator, wrapRequestHandler(getListMeAlbumController))

albumsRouter.get('/user/get-list-album/:id', accessTokenValidator, wrapRequestHandler(getListUserAlbumController))

export default albumsRouter
