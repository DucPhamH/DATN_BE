import { CreateBlogBody } from '~/models/requests/blog.request'
import BlogModel, { Blog } from '~/models/schemas/blog.schema'
import BlogCategoryModel from '~/models/schemas/blogCategory.schema'

class BlogsService {
  async getAllCategoryBlogsService() {
    const categoryBlogs = await BlogCategoryModel.find()
    return categoryBlogs
  }
  async createBlogService({ title, content, description, image, user_id, category_blog_id }: CreateBlogBody) {
    const blog = await BlogModel.create({
      title,
      content,
      description,
      image,
      user_id,
      category_blog_id
    })
    return blog
  }
}

const blogsService = new BlogsService()
export default blogsService
