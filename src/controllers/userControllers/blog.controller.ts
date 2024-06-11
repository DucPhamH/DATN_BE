import { Request, Response } from 'express'
import { BLOG_MESSAGE } from '~/constants/messages'
import { TokenPayload } from '~/models/requests/authUser.request'
import blogsService from '~/services/userServices/blog.services'

export const getAllCategoryBlogsController = async (req: Request, res: Response) => {
  const result = await blogsService.getAllCategoryBlogsService()
  return res.json({
    message: BLOG_MESSAGE.GET_BLOG_CATEGORIES_SUCCESS,
    result
  })
}

export const createBlogController = async (req: Request, res: Response) => {
  const { title, content, description, image, category_blog_id } = req.body
  const user = req.decoded_authorization as TokenPayload
  const result = await blogsService.createBlogService({
    title,
    content,
    description,
    image,
    user_id: user.user_id,
    category_blog_id
  })
  return res.json({
    message: BLOG_MESSAGE.CREATE_BLOG_SUCCESS,
    result
  })
}

export const getListBlogForChefController = async (req: Request, res: Response) => {
  const user = req.decoded_authorization as TokenPayload
  const { page, limit, sort, status, search, category_blog_id } = req.query

  console.log(sort, status, search, category_blog_id, page, limit)
  const result = await blogsService.getListBlogForChefService({
    user_id: user.user_id,
    page: Number(page),
    limit: Number(limit),
    sort: sort as string,
    status: status as string,
    search: search as string,
    category_blog_id: category_blog_id as string
  })
  return res.json({
    message: BLOG_MESSAGE.GET_BLOGS_SUCCESS,
    result
  })
}

export const getListBlogForUserController = async (req: Request, res: Response) => {
  const user = req.decoded_authorization as TokenPayload
  const { page, limit, sort, search, category_blog_id } = req.query
  const result = await blogsService.getListBlogForUserService({
    user_id: user.user_id,
    page: Number(page),
    limit: Number(limit),
    sort: sort as string,
    search: search as string,
    category_blog_id: category_blog_id as string
  })
  return res.json({
    message: BLOG_MESSAGE.GET_BLOGS_SUCCESS,
    result
  })
}

export const getListMeBlogController = async (req: Request, res: Response) => {
  const user = req.decoded_authorization as TokenPayload
  const { page, limit } = req.query
  const result = await blogsService.getListMeBlogService({
    user_id: user.user_id,
    page: Number(page),
    limit: Number(limit)
  })
  return res.json({
    message: BLOG_MESSAGE.GET_BLOGS_SUCCESS,
    result
  })
}

export const getListUserBlogController = async (req: Request, res: Response) => {
  const { id } = req.params
  const { page, limit } = req.query
  const result = await blogsService.getListUserBlogService({
    user_id: id,
    page: Number(page),
    limit: Number(limit)
  })
  return res.json({
    message: BLOG_MESSAGE.GET_BLOGS_SUCCESS,
    result
  })
}

export const getBlogForChefController = async (req: Request, res: Response) => {
  const user = req.decoded_authorization as TokenPayload
  const { id } = req.params
  const result = await blogsService.getBlogForChefService({ user_id: user.user_id, blog_id: id })
  return res.json({
    message: BLOG_MESSAGE.GET_BLOG_SUCCESS,
    result
  })
}

export const getBlogForUserController = async (req: Request, res: Response) => {
  const user = req.decoded_authorization as TokenPayload
  const { id } = req.params
  const result = await blogsService.getBlogForUserService({ blog_id: id })
  return res.json({
    message: BLOG_MESSAGE.GET_BLOG_SUCCESS,
    result
  })
}

export const updateBlogForChefController = async (req: Request, res: Response) => {
  const user = req.decoded_authorization as TokenPayload
  const { id } = req.params
  const { title, content, description, image, category_blog_id } = req.body
  const result = await blogsService.updateBlogForChefService({
    user_id: user.user_id,
    blog_id: id,
    title,
    content,
    description,
    image,
    category_blog_id
  })
  return res.json({
    message: BLOG_MESSAGE.UPDATE_BLOG_SUCCESS,
    result
  })
}

export const createCommentBlogController = async (req: Request, res: Response) => {
  const user = req.decoded_authorization as TokenPayload
  const { blog_id, content } = req.body
  const result = await blogsService.createCommentBlogService({
    user_id: user.user_id,
    blog_id,
    content
  })
  return res.json({
    message: BLOG_MESSAGE.CREATE_COMMENT_BLOG_SUCCESS,
    result
  })
}

export const deleteCommentBlogController = async (req: Request, res: Response) => {
  const user = req.decoded_authorization as TokenPayload
  const { comment_id } = req.body
  const result = await blogsService.deleteCommentBlogService({ user_id: user.user_id, comment_id: comment_id })
  return res.json({
    message: BLOG_MESSAGE.DELETE_COMMENT_BLOG_SUCCESS,
    result
  })
}

export const getCommentsBlogController = async (req: Request, res: Response) => {
  const { blog_id, page, limit } = req.query
  const result = await blogsService.getCommentsBlogService({
    blog_id: blog_id as string,
    page: Number(page),
    limit: Number(limit)
  })
  return res.json({
    message: BLOG_MESSAGE.GET_COMMENTS_BLOG_SUCCESS,
    result
  })
}

export const deleteBlogForChefController = async (req: Request, res: Response) => {
  const user = req.decoded_authorization as TokenPayload
  const { id } = req.params
  const result = await blogsService.deleteBlogForChefService({ user_id: user.user_id, blog_id: id })
  return res.json({
    message: BLOG_MESSAGE.DELETE_BLOG_SUCCESS,
    result
  })
}

export const randomThreeBlogLandingController = async (req: Request, res: Response) => {
  const result = await blogsService.randomThreeBlogLandingService()
  return res.json({
    message: BLOG_MESSAGE.GET_BLOGS_SUCCESS,
    result
  })
}
