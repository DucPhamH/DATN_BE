import { ObjectId } from 'mongodb'
import { AlbumStatus, BlogStatus, NotificationTypes, RecipeStatus, RecipeTime } from '~/constants/enums'
import {
  GetListAlbumForInspectorQuery,
  GetListBlogForInspectorQuery,
  GetListRecipeForInspectorQuery
} from '~/models/requests/inspector.request'
import AlbumModel from '~/models/schemas/album.schema'
import BlogModel from '~/models/schemas/blog.schema'
import CommentPostModel from '~/models/schemas/commentPost.schema'
import ImagePostModel from '~/models/schemas/imagePost.schema'
import LikePostModel from '~/models/schemas/likePost.schema'
import NotificationModel from '~/models/schemas/notification.schema'
import PostModel from '~/models/schemas/post.schema'
import RecipeModel from '~/models/schemas/recipe.schema'
import UserModel from '~/models/schemas/user.schema'
import { trainRecipesRecommender } from '~/utils/recommend'

class InspectorService {
  async getAllPostReportService({ page, limit, search }: { page: number; limit: number; search: string }) {
    if (!page) {
      page = 1
    }
    if (!limit) {
      limit = 10
    }
    const condition: any = {
      // lấy tất cả bài viết bị report
      report_post: { $ne: [] }
    }
    if (search) {
      condition.$text = { $search: search }
    }

    const posts = await PostModel.aggregate([
      {
        $match: condition
      },
      {
        $lookup: {
          from: 'image_posts',
          localField: '_id',
          foreignField: 'post_id',
          as: 'images'
        }
      },
      {
        $addFields: {
          images: {
            $map: {
              input: '$images',
              as: 'image',
              in: '$$image.url'
            }
          }
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
      // đếm số lượng report
      {
        $addFields: {
          report_count: { $size: '$report_post' }
        }
      },
      // sắp xếp theo số lượng report giảm dần
      {
        $sort: { report_count: -1 }
      },
      {
        $skip: (page - 1) * limit
      },
      {
        $limit: limit
      }
    ])
    const total = await PostModel.find(condition).countDocuments()
    const totalPage = Math.ceil(total / limit)
    return { posts, totalPage, page, limit }
  }
  async getPostReportDetailService({ post_id }: { post_id: string }) {
    const post = await PostModel.aggregate([
      {
        $match: { _id: new ObjectId(post_id) }
      },
      {
        $lookup: {
          from: 'image_posts',
          localField: '_id',
          foreignField: 'post_id',
          as: 'images'
        }
      },
      {
        $addFields: {
          images: {
            $map: {
              input: '$images',
              as: 'image',
              in: '$$image.url'
            }
          }
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
        $lookup: {
          from: 'posts',
          localField: 'parent_id',
          foreignField: '_id',
          as: 'parent_post'
        }
      },
      {
        $unwind: { path: '$parent_post', preserveNullAndEmptyArrays: true }
      },
      //lay image array cua post cha
      {
        $lookup: {
          from: 'image_posts',
          localField: 'parent_post._id',
          foreignField: 'post_id',
          as: 'parent_images'
        }
      },
      {
        $addFields: {
          parent_images: {
            $map: {
              input: '$parent_images',
              as: 'image',
              in: '$$image.url'
            }
          }
        }
      },
      // noi parent_post voi user de lay thong tin user cua post cha
      {
        $lookup: {
          from: 'users',
          localField: 'parent_post.user_id',
          foreignField: '_id',
          as: 'parent_user'
        }
      },
      {
        $unwind: { path: '$parent_user', preserveNullAndEmptyArrays: true }
      },
      {
        $project: {
          'user.password': 0,
          'parent_user.password': 0
        }
      },
      // nối từng phần tử trong mảng report_post với bảng users để lấy thông tin user report
      {
        $lookup: {
          from: 'users',
          localField: 'report_post.user_id',
          foreignField: '_id',
          as: 'report_user'
        }
      },
      {
        $addFields: {
          report_user: {
            $map: {
              input: '$report_user',
              as: 'user',
              in: {
                name: '$$user.user_name',
                avatar: '$$user.avatar',
                _id: '$$user._id'
              }
            }
          }
        }
      },
      // lấy từng user_id của report_post so sánh với _id của user để lấy thông tin user report sao cho các id trùng nhau
      {
        $addFields: {
          report_post: {
            $map: {
              input: '$report_post',
              as: 'report',
              in: {
                user_id: '$$report.user_id',
                reason: '$$report.reason',
                created_at: '$$report.created_at',
                user: {
                  $arrayElemAt: [
                    {
                      $filter: {
                        input: '$report_user',
                        as: 'user',
                        cond: { $eq: ['$$user._id', '$$report.user_id'] }
                      }
                    },
                    0
                  ]
                }
              }
            }
          }
        }
      },
      {
        $project: {
          report_user: 0
        }
      }
    ])
    return post
  }
  async acceptPostReportService({ post_id }: { post_id: string }) {
    // cập nhật lại report_post về rỗng
    const post = await PostModel.findOneAndUpdate(
      { _id: new ObjectId(post_id) },
      {
        $set: {
          report_post: []
        }
      },
      { new: true }
    )
    return post
  }
  async deletePostReportService({ post_id, user_id }: { post_id: string; user_id: string }) {
    await Promise.all([
      PostModel.findOneAndDelete({
        _id: post_id
      }),
      ImagePostModel.deleteMany({
        post_id: post_id
      }),
      LikePostModel.deleteMany({
        post_id: post_id
      }),
      CommentPostModel.deleteMany({
        post_id: post_id
      })
    ])
    const share_post = await PostModel.find({
      parent_id: post_id
    })
    await Promise.all(
      share_post.map(async (sp) => {
        await Promise.all([
          PostModel.findOneAndDelete({
            _id: sp._id
          }),
          ImagePostModel.deleteMany({
            post_id: sp._id
          }),
          LikePostModel.deleteMany({
            post_id: sp._id
          }),
          CommentPostModel.deleteMany({
            post_id: sp._id
          })
        ])
      })
    )

    // tăng banned_count của user  = banned_count + 1
    const user = await UserModel.findById(user_id)
    console.log(user_id)
    console.log(user)

    if (user) {
      await UserModel.updateOne(
        { _id: user_id },
        {
          $set: {
            banned_count: (user.banned_count ?? 0) + 1
          }
        }
      )
      await NotificationModel.create({
        receiver_id: user_id,
        content: 'Một bài viết của bạn đã bị xóa do vi phạm quy định của hệ thống',
        link_id: post_id,
        type: NotificationTypes.system
      })
    }
    return true
  }
  async getListBlogForInspectorService({ page, limit, sort, search, category_blog_id }: GetListBlogForInspectorQuery) {
    const condition: any = {
      status: BlogStatus.pending
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
        $unwind: '$user'
      },
      // bỏ password của user
      {
        $project: {
          'user.password': 0,
          content: 0
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
  async acceptBlogService({ blog_id }: { blog_id: string }) {
    const blog = await BlogModel.findOneAndUpdate(
      { _id: new ObjectId(blog_id) },
      {
        $set: {
          status: BlogStatus.accepted
        }
      },
      { new: true }
    )
    return blog
  }
  async rejectBlogService({ blog_id }: { blog_id: string }) {
    const blog = await BlogModel.findOneAndUpdate(
      { _id: new ObjectId(blog_id) },
      {
        $set: {
          status: BlogStatus.rejected
        }
      },
      { new: true }
    )
    return blog
  }
  async getBlogDetailForInspectorService({ blog_id }: { blog_id: string }) {
    const blog = await BlogModel.aggregate([
      {
        $match: { _id: new ObjectId(blog_id) }
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
      // bỏ password của user
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
  async getListRecipesForInspectorService({
    page,
    limit,
    sort,
    search,
    category_recipe_id,
    difficult_level,
    processing_food,
    region,
    interval_time
  }: GetListRecipeForInspectorQuery) {
    const condition: any = {
      status: RecipeStatus.pending,
      album_id: null
    }

    console.log(sort)

    if (search !== undefined) {
      // condition.search_fields = { $regex: search, $options: 'i' }
      condition.$text = { $search: search }
    }

    if (!page) {
      page = 1
    }

    if (!limit) {
      limit = 10
    }

    if (category_recipe_id !== undefined) {
      condition.category_recipe_id = new ObjectId(category_recipe_id)
    }

    if (difficult_level || difficult_level === 0) {
      condition.difficult_level = difficult_level
    }

    if (processing_food !== undefined) {
      console.log(processing_food)
      condition.processing_food = processing_food as string
    }

    console.log(condition)

    if (region || region === 0) {
      condition.region = region
    }

    if (interval_time || interval_time === 0) {
      if (interval_time === RecipeTime.lessThan15) {
        condition.time = { $lte: 15 }
      }

      if (interval_time === RecipeTime.from15To30) {
        condition.time = { $gte: 15, $lte: 30 }
      }

      if (interval_time === RecipeTime.from30To60) {
        condition.time = { $gte: 30, $lte: 60 }
      }

      if (interval_time === RecipeTime.from60To120) {
        condition.time = { $gte: 60, $lte: 120 }
      }

      if (interval_time === RecipeTime.moreThan120) {
        condition.time = { $gte: 120 }
      }
    }

    const recipes = await RecipeModel.aggregate([
      {
        $match: condition
      },
      {
        $lookup: {
          from: 'recipe_categories',
          localField: 'category_recipe_id',
          foreignField: '_id',
          as: 'category_recipe'
        }
      },
      {
        $unwind: '$category_recipe'
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
      // loại bỏ password của user
      {
        $project: {
          'user.password': 0,
          content: 0
        }
      },
      {
        $sort: { createdAt: sort === 'asc' ? 1 : -1 }
      },
      {
        $skip: (page - 1) * limit
      },
      {
        $limit: limit
      }
    ])

    const findRecipes = await RecipeModel.find(condition)
    const totalPage = Math.ceil(findRecipes.length / limit)

    return {
      recipes,
      totalPage,
      page,
      limit
    }
  }
  async getRecipeDetailForInspectorService({ recipe_id }: { recipe_id: string }) {
    const recipe = await RecipeModel.aggregate([
      {
        $match: { _id: new ObjectId(recipe_id) }
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
          from: 'recipe_categories',
          localField: 'category_recipe_id',
          foreignField: '_id',
          as: 'category_recipe'
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
        $unwind: '$category_recipe'
      }
    ])
    return recipe
  }
  async acceptRecipeService({ recipe_id }: { recipe_id: string }) {
    const recipe = await RecipeModel.findOneAndUpdate(
      { _id: new ObjectId(recipe_id) },
      {
        $set: {
          status: RecipeStatus.accepted
        }
      },
      { new: true }
    )
    await trainRecipesRecommender()
    return recipe
  }
  async rejectRecipeService({ recipe_id }: { recipe_id: string }) {
    const recipe = await RecipeModel.findOneAndUpdate(
      { _id: new ObjectId(recipe_id) },
      {
        $set: {
          status: RecipeStatus.rejected
        }
      },
      { new: true }
    )
    return recipe
  }
  async getListAlbumForInspectorService({ page, limit, search, category_album, sort }: GetListAlbumForInspectorQuery) {
    const condition: any = {
      status: AlbumStatus.pending
    }

    if (search !== undefined) {
      // condition.search_fields = { $regex: search, $options: 'i' }
      condition.$text = { $search: search }
    }

    if (!page) {
      page = 1
    }

    if (!limit) {
      limit = 8
    }

    if (category_album !== undefined) {
      condition.category_album = category_album
    }
    console.log(condition)

    const albums = await AlbumModel.aggregate([
      {
        $match: condition
      },
      {
        $lookup: {
          from: 'recipes',
          localField: '_id',
          foreignField: 'album_id',
          as: 'recipes'
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
      // bỏ password của user
      {
        $project: {
          'user.password': 0
        }
      },
      {
        $sort: { createdAt: sort === 'asc' ? 1 : -1 }
      },
      {
        $skip: (page - 1) * limit
      },
      {
        $limit: limit
      }
    ])

    const totalAlbums = await AlbumModel.countDocuments(condition)
    const totalPage = Math.ceil(totalAlbums / limit)

    return {
      albums,
      totalPage,
      page,
      limit
    }
  }
  async getAlbumDetailForInspectorService({ album_id }: { album_id: string }) {
    const album = await AlbumModel.aggregate([
      {
        $match: { _id: new ObjectId(album_id) }
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
      // bỏ password của user
      {
        $project: {
          'user.password': 0
        }
      }
    ])
    return album
  }
  async getRecipesInAlbumForInspectorService({
    album_id,
    limit,
    page
  }: {
    album_id: string
    limit: number
    page: number
  }) {
    if (!page) {
      page = 1
    }

    if (!limit) {
      limit = 10
    }
    const recipes = await RecipeModel.aggregate([
      {
        $match: {
          album_id: new ObjectId(album_id)
        }
      },
      {
        $lookup: {
          from: 'recipe_categories',
          localField: 'category_recipe_id',
          foreignField: '_id',
          as: 'category_recipe'
        }
      },
      {
        $unwind: '$category_recipe'
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
      // loại bỏ password của user
      {
        $project: {
          'user.password': 0
        }
      },
      {
        $sort: { createdAt: -1 }
      },
      {
        $skip: (page - 1) * limit
      },
      {
        $limit: limit
      }
    ])

    const findRecipes = await RecipeModel.find({ album_id: new ObjectId(album_id) })
    const totalPage = Math.ceil(findRecipes.length / limit)

    return {
      recipes,
      totalPage,
      page,
      limit
    }
  }
  async acceptAlbumService({ album_id }: { album_id: string }) {
    const album = await AlbumModel.findOneAndUpdate(
      { _id: new ObjectId(album_id) },
      {
        $set: {
          status: AlbumStatus.accepted
        }
      },
      { new: true }
    )
    // cập nhật status của các recipe trong album thành accepted
    await RecipeModel.updateMany(
      { album_id: new ObjectId(album_id) },
      {
        $set: {
          status: RecipeStatus.accepted
        }
      }
    )
    await trainRecipesRecommender()
    return album
  }
  async rejectAlbumService({ album_id }: { album_id: string }) {
    const album = await AlbumModel.findOneAndUpdate(
      { _id: new ObjectId(album_id) },
      {
        $set: {
          status: AlbumStatus.rejected
        }
      },
      { new: true }
    )
    // xem những recipes nào có status là pending thì cập nhật thành rejected
    // await RecipeModel.updateMany(
    //   { album_id: new ObjectId(album_id), status: RecipeStatus.pending },
    //   {
    //     $set: {
    //       status: RecipeStatus.rejected
    //     }
    //   }
    // )
    return album
  }
}

const inspectorService = new InspectorService()
export default inspectorService
