import BlogsModel, { Blogs } from '~/models/schemas/blog.schema'

class BlogsService {
  async createBlog(blog: Blogs) {
    const newBlog = await BlogsModel.create(blog)
    return newBlog
  }
  async getBlogs() {
    const blogs = await BlogsModel.aggregate([
      {
        $lookup: {
          from: 'users',
          localField: 'userID',
          foreignField: '_id',
          as: 'user'
        }
      },
      {
        $unwind: '$user'
      }
    ])
    return blogs
  }
}

const blogsService = new BlogsService()
export default blogsService
