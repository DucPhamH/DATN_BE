import { Router } from 'express'
import { UserRoles } from '~/constants/enums'
import {
  createBlogController,
  createCommentBlogController,
  deleteBlogForChefController,
  deleteCommentBlogController,
  getAllCategoryBlogsController,
  getBlogForChefController,
  getBlogForUserController,
  getCommentsBlogController,
  getListBlogForChefController,
  getListBlogForUserController,
  updateBlogForChefController
} from '~/controllers/userControllers/blog.controller'
import { accessTokenValidator } from '~/middlewares/authUser.middleware'
import {
  commentBlogValidator,
  createBlogValidator,
  getListBlogsForChefValidator,
  limitAndPageValidator
} from '~/middlewares/blog.middleware'
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
  '/user/get-blogs',
  accessTokenValidator,
  getListBlogsForChefValidator,
  wrapRequestHandler(getListBlogForUserController)
)
blogsRouter.get(
  '/chef/get-blog/:id',
  accessTokenValidator,
  checkRole([UserRoles.user]),
  wrapRequestHandler(getBlogForChefController)
)
blogsRouter.get('/user/get-blog/:id', accessTokenValidator, wrapRequestHandler(getBlogForUserController))

blogsRouter.put(
  '/chef/update-blog/:id',
  accessTokenValidator,
  checkRole([UserRoles.user]),
  wrapRequestHandler(updateBlogForChefController)
)

blogsRouter.post(
  '/actions/comment',
  accessTokenValidator,
  commentBlogValidator,
  wrapRequestHandler(createCommentBlogController)
)

blogsRouter.get(
  '/actions/comment',
  accessTokenValidator,
  limitAndPageValidator,
  wrapRequestHandler(getCommentsBlogController)
)

blogsRouter.post('/actions/delete-comment', accessTokenValidator, wrapRequestHandler(deleteCommentBlogController))
blogsRouter.delete(
  '/chef/delete-blog/:id',
  accessTokenValidator,
  checkRole([UserRoles.user]),
  wrapRequestHandler(deleteBlogForChefController)
)

export default blogsRouter
