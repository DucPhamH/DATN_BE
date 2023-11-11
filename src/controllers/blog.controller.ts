import { Request, Response } from 'express'
import blogsService from '~/services/blog.services'

export const createBlogController = async (req: Request, res: Response) => {
  try {
    const result = await blogsService.createBlog(req.body)
    return res.json({
      message: 'Blog created successfully',
      result: result
    })
  } catch (error) {
    return res.status(400).json({
      message: 'Error creating blog',
      error
    })
  }
}

export const getBlogsController = async (req: Request, res: Response) => {
  try {
    const result = await blogsService.getBlogs()
    return res.json({
      message: 'Blogs fetched successfully',
      result: result
    })
  } catch (error) {
    return res.status(400).json({
      message: 'Error fetching blogs',
      error
    })
  }
}
