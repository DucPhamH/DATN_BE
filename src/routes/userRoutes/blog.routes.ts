import { Router } from 'express'
import { UserRoles } from '~/constants/enums'
import {
  createBlogController,
  getAllCategoryBlogsController,
  getBlogForChefController,
  getListBlogForChefController,
  updateBlogForChefController
} from '~/controllers/userControllers/blog.controller'
import { accessTokenValidator } from '~/middlewares/authUser.middleware'
import { createBlogValidator, getListBlogsForChefValidator } from '~/middlewares/blog.middleware'
import { checkRole } from '~/middlewares/roles.middleware'
import { wrapRequestHandler } from '~/utils/handler'

const blogsRouter = Router()

blogsRouter.get('/category/get-category', wrapRequestHandler(getAllCategoryBlogsController))
blogsRouter.post('/', accessTokenValidator, createBlogValidator, wrapRequestHandler(createBlogController))
blogsRouter.get(
  '/chef/get-blogs',
  accessTokenValidator,
  checkRole([UserRoles.user]),
  getListBlogsForChefValidator,
  wrapRequestHandler(getListBlogForChefController)
)
blogsRouter.get(
  '/chef/get-blog/:id',
  accessTokenValidator,
  checkRole([UserRoles.user]),
  wrapRequestHandler(getBlogForChefController)
)

blogsRouter.put(
  '/chef/update-blog/:id',
  accessTokenValidator,
  checkRole([UserRoles.user]),
  wrapRequestHandler(updateBlogForChefController)
)

export default blogsRouter
