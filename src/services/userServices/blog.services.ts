import { ObjectId } from 'mongodb'
import { BlogStatus } from '~/constants/enums'
import { CreateBlogBody, GetListBlogForChefQuery, UpdateBlogForChefBody } from '~/models/requests/blog.request'
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
  async getListBlogForChefService({
    user_id,
    page,
    limit,
    sort,
    status,
    search,
    category_blog_id
  }: GetListBlogForChefQuery) {
    console.log(sort, status, search, category_blog_id)
    const condition: any = {
      user_id: new ObjectId(user_id),
      writer_id: null,
      is_banned: false
    }

    if (status) {
      condition.status = parseInt(status)
    }

    if (search !== undefined) {
      condition.title = { $regex: search, $options: 'i' }
    }

    if (category_blog_id !== undefined) {
      condition.category_blog_id = new ObjectId(category_blog_id)
    }

    if (!page) {
      page = 1
    }

    if (!limit) {
      limit = 10
    }

    console.log(condition)

    const blogs = await BlogModel.aggregate([
      {
        $match: condition
      },
      {
        $lookup: {
          from: 'users',
          localField: 'user_id',
          foreignField: '_id',
          as: 'user'
        }
      },
      {
        $lookup: {
          from: 'category_blogs',
          localField: 'category_blog_id',
          foreignField: '_id',
          as: 'category_blog'
        }
      },
      {
        $unwind: '$user'
      },
      {
        $unwind: '$category_blog'
      },
      // nếu không có sort thì mặc định là mới nhất
      {
        $sort: {
          createdAt: sort === 'asc' ? 1 : -1
        }
      },
      {
        $skip: (page - 1) * limit
      },
      {
        $limit: limit
      }
    ])

    const findBlogs = await BlogModel.find(condition)
    const totalPage = Math.ceil(findBlogs.length / limit)

    return { blogs, totalPage, limit, page }
  }
  async getBlogForChefService({ user_id, blog_id }: { user_id: string; blog_id: string }) {
    const blog = await BlogModel.aggregate([
      {
        $match: {
          _id: new ObjectId(blog_id),
          user_id: new ObjectId(user_id)
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: 'user_id',
          foreignField: '_id',
          as: 'user'
        }
      },
      {
        $lookup: {
          from: 'category_blogs',
          localField: 'category_blog_id',
          foreignField: '_id',
          as: 'category_blog'
        }
      },
      {
        $unwind: '$user'
      },
      {
        $unwind: '$category_blog'
      }
    ])
    return blog
  }
  async updateBlogForChefService({
    user_id,
    blog_id,
    title,
    content,
    description,
    image,
    category_blog_id
  }: UpdateBlogForChefBody) {
    console.log(user_id, blog_id, title, content, description, image, category_blog_id)
    // update có thể update 1 hay nhiều field
    const blog = await BlogModel.findOneAndUpdate(
      {
        _id: new ObjectId(blog_id),
        user_id: new ObjectId(user_id)
      },
      {
        title,
        content,
        description,
        image,
        category_blog_id,
        status: BlogStatus.pending
      },
      { new: true }
    )
    return blog
  }
}

const blogsService = new BlogsService()
export default blogsService
