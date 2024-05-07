import { Router } from 'express'
import {
  createAlbumController,
  deleteRecipeInAlbumForChefController,
  getAlbumForChefController,
  getAlbumForUserController,
  getListAlbumForChefController,
  getListAlbumForUserController,
  updateAlbumForChefController
} from '~/controllers/userControllers/album.controller'
import { createAlbumValidator, getListAlbumForChefValidator } from '~/middlewares/album.middleware'
import { accessTokenValidator } from '~/middlewares/authUser.middleware'
import { wrapRequestHandler } from '~/utils/handler'

const albumsRouter = Router()

albumsRouter.post('/', accessTokenValidator, createAlbumValidator, wrapRequestHandler(createAlbumController))

albumsRouter.get(
  '/chef/get-albums',
  accessTokenValidator,
  getListAlbumForChefValidator,
  wrapRequestHandler(getListAlbumForChefController)
)

albumsRouter.get('/user/get-albums', getListAlbumForChefValidator, wrapRequestHandler(getListAlbumForUserController))

albumsRouter.get('/user/get-album/:id', wrapRequestHandler(getAlbumForUserController))

albumsRouter.post(
  '/chef/delete-recipe-in-album',
  accessTokenValidator,
  wrapRequestHandler(deleteRecipeInAlbumForChefController)
)

albumsRouter.put(
  '/chef/update-album/:id',
  accessTokenValidator,
  createAlbumValidator,
  wrapRequestHandler(updateAlbumForChefController)
)

albumsRouter.get('/chef/get-album/:id', accessTokenValidator, wrapRequestHandler(getAlbumForChefController))

export default albumsRouter
