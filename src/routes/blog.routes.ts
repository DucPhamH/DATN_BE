import { Router } from 'express'
import { createBlogController, getBlogsController } from '~/controllers/blog.controller'

const blogsRouter = Router()

blogsRouter.post('/', createBlogController)

blogsRouter.get('/', getBlogsController)

export default blogsRouter
