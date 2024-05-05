import { Router } from 'express'
import {
  createAlbumController,
  getAlbumForChefController,
  getListAlbumForChefController
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

albumsRouter.get('/chef/get-album/:id', accessTokenValidator, wrapRequestHandler(getAlbumForChefController))

export default albumsRouter
