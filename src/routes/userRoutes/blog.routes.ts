import { Router } from 'express'
import { createBlogController, getAllCategoryBlogsController } from '~/controllers/blog.controller'
import { accessTokenValidator } from '~/middlewares/authUser.middleware'
import { createBlogValidator } from '~/middlewares/blog.middleware'
import { wrapRequestHandler } from '~/utils/handler'

const blogsRouter = Router()

blogsRouter.get('/category/get-category', wrapRequestHandler(getAllCategoryBlogsController))
blogsRouter.post('/', accessTokenValidator, createBlogValidator, wrapRequestHandler(createBlogController))

export default blogsRouter
