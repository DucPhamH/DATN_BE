import { ObjectId } from 'mongodb'
import { BlogStatus, NotificationTypes } from '~/constants/enums'
import HTTP_STATUS from '~/constants/httpStatus'
import { BLOG_MESSAGE } from '~/constants/messages'
import {
  CreateBlogBody,
  GetListBlogForChefQuery,
  GetListBlogForUserQuery,
  UpdateBlogForChefBody
} from '~/models/requests/blog.request'
import BlogModel, { Blog } from '~/models/schemas/blog.schema'
import BlogCategoryModel from '~/models/schemas/blogCategory.schema'
import CommentBlogModel from '~/models/schemas/commentBlog.schema'
import NotificationModel from '~/models/schemas/notification.schema'
import { ErrorWithStatus } from '~/utils/error'

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
      // không lấy những blog bị banned
      status: { $ne: BlogStatus.banned }
    }

    if (status) {
      condition.status = parseInt(status)
    }

    if (search !== undefined) {
      // condition.search_fields = { $regex: search, $options: 'i' }
      condition.$text = { $search: search }
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
        $project: {
          'user.password': 0,
          content: 0
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
  async getListMeBlogService({ user_id, limit, page }: { user_id: string; limit: number; page: number }) {
    if (!page) {
      page = 1
    }

    if (!limit) {
      limit = 10
    }

    const blogs = await BlogModel.aggregate([
      {
        $match: {
          user_id: new ObjectId(user_id),
          status: BlogStatus.accepted
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
        $project: {
          'user.password': 0,
          content: 0
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
          createdAt: -1
        }
      },
      {
        $skip: (page - 1) * limit
      },
      {
        $limit: limit
      }
    ])

    const findBlogs = await BlogModel.find({ user_id: new ObjectId(user_id), status: BlogStatus.accepted })
    const totalPage = Math.ceil(findBlogs.length / limit)

    return { blogs, totalPage, limit, page }
  }
  async getListUserBlogService({ user_id, limit, page }: { user_id: string; limit: number; page: number }) {
    if (!page) {
      page = 1
    }

    if (!limit) {
      limit = 10
    }

    const blogs = await BlogModel.aggregate([
      {
        $match: {
          user_id: new ObjectId(user_id),
          status: BlogStatus.accepted
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
        $project: {
          'user.password': 0,
          content: 0
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
          createdAt: -1
        }
      },
      {
        $skip: (page - 1) * limit
      },
      {
        $limit: limit
      }
    ])

    const findBlogs = await BlogModel.find({ user_id: new ObjectId(user_id), status: BlogStatus.accepted })
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
        $project: {
          'user.password': 0
        }
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
  async getListBlogForUserService({ page, limit, sort, search, category_blog_id, user_id }: GetListBlogForUserQuery) {
    const condition: any = {
      status: BlogStatus.accepted
    }

    if (search !== undefined) {
      // condition.search_fields = { $regex: search, $options: 'i' }
      condition.$text = { $search: search }
    }

    if (category_blog_id !== undefined) {
      condition.category_blog_id = new ObjectId(category_blog_id)
    }

    if (!page) {
      page = 1
    }

    if (!limit) {
      limit = 8
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
        $project: {
          'user.password': 0,
          content: 0
        }
      },
      {
        $unwind: '$user'
      },
      // bỏ password của user
      {
        $project: {
          'user.password': 0
        }
      },
      {
        $unwind: '$category_blog'
      },
      // nối comment
      {
        $lookup: {
          from: 'comment_blogs',
          localField: '_id',
          foreignField: 'blog_id',
          as: 'comments'
        }
      },
      // bỏ qua những comments bị banned
      {
        $addFields: {
          comments: {
            $filter: {
              input: '$comments',
              as: 'comment',
              cond: { $eq: ['$$comment.is_banned', false] }
            }
          }
        }
      },
      // đếm số lượng comment
      {
        $addFields: {
          comment_count: { $size: '$comments' }
        }
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
  async getBlogForUserService({ blog_id }: { blog_id: string }) {
    const blog = await BlogModel.aggregate([
      {
        $match: {
          _id: new ObjectId(blog_id),
          status: BlogStatus.accepted
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
        $project: {
          'user.password': 0
        }
      },
      {
        $unwind: '$category_blog'
      },
      {
        $lookup: {
          from: 'comment_blogs',
          localField: '_id',
          foreignField: 'blog_id',
          as: 'comments'
        }
      },
      {
        $addFields: {
          comments: {
            $filter: {
              input: '$comments',
              as: 'comment',
              cond: { $eq: ['$$comment.is_banned', false] }
            }
          }
        }
      },
      {
        $addFields: {
          comment_count: { $size: '$comments' }
        }
      }
    ])
    // tăng user view lên 1
    if (blog[0]) {
      await BlogModel.updateOne(
        {
          _id: new ObjectId(blog_id)
        },
        {
          user_view: blog[0].user_view + 1
        }
      )
    }

    return blog
  }
  async createCommentBlogService({ content, user_id, blog_id }: { content: string; user_id: string; blog_id: string }) {
    const comment = await CommentBlogModel.create({
      content,
      user_id: new ObjectId(user_id),
      blog_id: new ObjectId(blog_id)
    })

    const user_blog_id = await BlogModel.findOne({ _id: blog_id })

    if (!user_blog_id) {
      throw new ErrorWithStatus({
        message: BLOG_MESSAGE.BLOG_NOT_FOUND,
        status: HTTP_STATUS.NOT_FOUND
      })
    }

    if (user_blog_id.user_id.toString() !== user_id) {
      await NotificationModel.create({
        sender_id: new ObjectId(user_id),
        receiver_id: user_blog_id.user_id,
        content: 'Đã bình luận blog của bạn',
        name_notification: user_blog_id.title || 'Blog không có tiêu đề',
        link_id: blog_id,
        type: NotificationTypes.commentBlog
      })
    }
    return comment
  }
  async deleteCommentBlogService({ user_id, comment_id }: { user_id: string; comment_id: string }) {
    await CommentBlogModel.findOneAndDelete({
      _id: new ObjectId(comment_id),
      user_id: new ObjectId(user_id)
    })
    return true
  }
  async getCommentsBlogService({ page, limit, blog_id }: { page: number; limit: number; blog_id: string }) {
    if (!limit) {
      limit = 3
    }
    if (!page) {
      page = 1
    }
    const comments = await CommentBlogModel.aggregate([
      {
        $match: {
          blog_id: new ObjectId(blog_id),
          is_banned: false
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
        $unwind: '$user'
      },
      {
        $project: {
          'user.password': 0
        }
      },
      {
        $sort: {
          createdAt: -1
        }
      },
      {
        $skip: (page - 1) * limit
      },
      {
        $limit: limit
      }
    ])
    return {
      comments,
      limit,
      page
    }
  }
  async deleteBlogForChefService({ user_id, blog_id }: { user_id: string; blog_id: string }) {
    // tìm blog
    const blog = await BlogModel.findOne({
      _id: new ObjectId(blog_id),
      user_id: new ObjectId(user_id)
    })
    console.log(blog)
    if (!blog) {
      throw new ErrorWithStatus({
        message: BLOG_MESSAGE.BLOG_NOT_FOUND,
        status: HTTP_STATUS.NOT_FOUND
      })
    }
    if (blog) {
      // xóa comment
      await CommentBlogModel.deleteMany({
        blog_id: new ObjectId(blog_id)
      })
      // xóa blog
      await BlogModel.deleteOne({
        _id: new ObjectId(blog_id),
        user_id: new ObjectId(user_id)
      })
    }
    return true
  }
  async randomThreeBlogLandingService() {
    const blogs = await BlogModel.aggregate([
      {
        $match: {
          status: BlogStatus.accepted
        }
      },
      {
        $sample: { size: 3 }
      }
    ])
    return blogs
  }
}

const blogsService = new BlogsService()
export default blogsService
