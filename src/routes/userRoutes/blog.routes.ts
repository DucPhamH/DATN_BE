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
  getListMeBlogController,
  getListUserBlogController,
  randomThreeBlogLandingController,
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

blogsRouter.post(
  '/',
  accessTokenValidator,
  wrapRequestHandler(checkRole([UserRoles.chef])),
  createBlogValidator,
  wrapRequestHandler(createBlogController)
)

blogsRouter.get(
  '/chef/get-blogs',
  accessTokenValidator,
  wrapRequestHandler(checkRole([UserRoles.chef])),
  getListBlogsForChefValidator,
  wrapRequestHandler(getListBlogForChefController)
)

blogsRouter.get(
  '/chef/get-blog/:id',
  accessTokenValidator,
  wrapRequestHandler(checkRole([UserRoles.chef])),
  wrapRequestHandler(getBlogForChefController)
)

blogsRouter.put(
  '/chef/update-blog/:id',
  accessTokenValidator,
  wrapRequestHandler(checkRole([UserRoles.chef])),
  wrapRequestHandler(updateBlogForChefController)
)

blogsRouter.delete(
  '/chef/delete-blog/:id',
  accessTokenValidator,
  wrapRequestHandler(checkRole([UserRoles.chef])),
  wrapRequestHandler(deleteBlogForChefController)
)

blogsRouter.get(
  '/user/get-blogs',
  accessTokenValidator,
  getListBlogsForChefValidator,
  wrapRequestHandler(getListBlogForUserController)
)

blogsRouter.get('/me/get-list-blog', accessTokenValidator, wrapRequestHandler(getListMeBlogController))

blogsRouter.get('/user/get-list-blog/:id', accessTokenValidator, wrapRequestHandler(getListUserBlogController))

blogsRouter.get('/user/get-blog/:id', accessTokenValidator, wrapRequestHandler(getBlogForUserController))

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

blogsRouter.get('/random-blog', wrapRequestHandler(randomThreeBlogLandingController))

export default blogsRouter
