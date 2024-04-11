import exp from 'constants'
import { Request, Response } from 'express'
import { BLOG_MESSAGE } from '~/constants/messages'
import { TokenPayload } from '~/models/requests/authUser.request'
import blogsService from '~/services/blog.services'

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
