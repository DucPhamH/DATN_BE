import { Router } from 'express'
import {
  createPostController,
  getPostController,
  likePostController,
  sharePostController,
  unLikePostController
} from '~/controllers/post.controller'
import { accessTokenValidator } from '~/middlewares/authUser.middleware'
import { wrapRequestHandler } from '~/utils/handler'
import upload from '~/utils/multer'

const postsRouter = Router()

postsRouter.post('/', accessTokenValidator, upload.array('image', 5), wrapRequestHandler(createPostController))
postsRouter.post('/actions/like', accessTokenValidator, wrapRequestHandler(likePostController))
postsRouter.post('/actions/unlike', accessTokenValidator, wrapRequestHandler(unLikePostController))
postsRouter.post('/actions/share', accessTokenValidator, wrapRequestHandler(sharePostController))
postsRouter.get('/:post_id', accessTokenValidator, wrapRequestHandler(getPostController))

export default postsRouter
