import { Router } from 'express'
import { createPostController } from '~/controllers/post.controller'
import { accessTokenValidator } from '~/middlewares/authUser.middleware'
import { wrapRequestHandler } from '~/utils/handler'
import upload from '~/utils/multer'

const postsRouter = Router()

postsRouter.post('/', accessTokenValidator, upload.array('image', 5), wrapRequestHandler(createPostController))

export default postsRouter
