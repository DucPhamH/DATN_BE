import exp from 'constants'
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

export const getBlogForChefController = async (req: Request, res: Response) => {
  const user = req.decoded_authorization as TokenPayload
  const { id } = req.params
  const result = await blogsService.getBlogForChefService({ user_id: user.user_id, blog_id: id })
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
