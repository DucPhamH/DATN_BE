import { omit } from 'lodash'
import { ObjectId } from 'mongodb'
import { AlbumStatus, BlogStatus, RecipeStatus, RequestType, UserRoles, UserStatus } from '~/constants/enums'
import { CreateUserAdminBody, GetListUserAdminQuery } from '~/models/requests/userAdmin.request'
import AlbumModel from '~/models/schemas/album.schema'
import BlogModel from '~/models/schemas/blog.schema'
import BookmarkAlbumModel from '~/models/schemas/bookmarkAlbum.schema'
import BookmarkRecipeModel from '~/models/schemas/bookmarkRecipe.schema'
import CommentBlogModel from '~/models/schemas/commentBlog.schema'
import CommentPostModel from '~/models/schemas/commentPost.schema'
import CommentRecipeModel from '~/models/schemas/commentRecipe.schema'
import FollowModel from '~/models/schemas/follow.schema'
import ImagePostModel from '~/models/schemas/imagePost.schema'
import LikePostModel from '~/models/schemas/likePost.schema'
import LikeRecipeModel from '~/models/schemas/likeRecipe.schema'
import MealItemModel from '~/models/schemas/mealItem.schema'
import MealScheduleModel from '~/models/schemas/mealSchedule.schema'
import PostModel from '~/models/schemas/post.schema'
import RecipeModel from '~/models/schemas/recipe.schema'
import RefreshTokenModel from '~/models/schemas/refreshToken.schema'
import UserModel from '~/models/schemas/user.schema'
import WorkoutItemModel from '~/models/schemas/workoutItem.schemas'
import WorkoutScheduleModel from '~/models/schemas/workoutSchedule.schema'
import { hashPassword } from '~/utils/crypto'
import { sendAcceptEmailNodeMailer, sendRejectEmailNodeMailer } from '~/utils/emailMailer'

class UserAdminService {
  async getAllUserService({ page, limit, role, status, search, sort }: GetListUserAdminQuery) {
    if (!page) {
      page = 1
    }
    if (!limit) {
      limit = 10
    }
    if (!role) {
      role = UserRoles.user
    }
    // nếu không truyền status thì mặc định status = 1 còn nếu truyền status = 0 thì status = 0
    if (!status && status !== 0) {
      status = UserStatus.active
    }

    const condition: any = {}
    console.log('role', role)

    condition.role = role
    condition.status = status

    if (search) {
      condition.$text = { $search: search }
    }

    console.log(condition)
    const users = await UserModel.find(condition)
      .sort({ createdAt: sort === 'asc' ? 1 : -1 })
      .skip((page - 1) * limit)
      .limit(limit)

    const total = await UserModel.countDocuments(condition)
    const totalPage = Math.ceil(total / limit)
    return {
      users,
      limit,
      page,
      totalPage
    }
  }
  async getUserByIdService(user_id: string) {
    const user = await UserModel.aggregate([
      // lấy những người follow mình
      {
        $match: {
          _id: new ObjectId(user_id)
        }
      },
      {
        $lookup: {
          from: 'follows',
          localField: '_id',
          foreignField: 'follow_id',
          as: 'followers'
        }
      },
      // nối followers vào bảng user để lấy thông tin những người follow mình
      {
        $lookup: {
          from: 'users',
          localField: 'followers.user_id',
          foreignField: '_id',
          as: 'followers'
        }
      },
      // đếm số người follow mình
      {
        $addFields: {
          followers_count: { $size: '$followers' }
        }
      },
      // xóa password trong mảng followers
      {
        $addFields: {
          followers: {
            $map: {
              input: '$followers',
              as: 'follower',
              in: {
                _id: '$$follower._id',
                email: '$$follower.email',
                name: '$$follower.name',
                avatar: '$$follower.avatar'
              }
            }
          }
        }
      },
      // nối với bảng posts để lấy số bài viết
      {
        $lookup: {
          from: 'posts',
          localField: '_id',
          foreignField: 'user_id',
          as: 'posts'
        }
      },
      // đếm số bài viết
      {
        $addFields: {
          posts_count: { $size: '$posts' }
        }
      },
      // nối với bảng albums để lấy số album
      {
        $lookup: {
          from: 'albums',
          localField: '_id',
          foreignField: 'user_id',
          as: 'albums'
        }
      },
      // đếm số album
      {
        $addFields: {
          albums_count: { $size: '$albums' }
        }
      },
      // nối với bảng recipes để lấy số công thức
      {
        $lookup: {
          from: 'recipes',
          localField: '_id',
          foreignField: 'user_id',
          as: 'recipes'
        }
      },
      // đếm số công thức
      {
        $addFields: {
          recipes_count: { $size: '$recipes' }
        }
      },
      // nối với bảng blogs để lấy số blog
      {
        $lookup: {
          from: 'blogs',
          localField: '_id',
          foreignField: 'user_id',
          as: 'blogs'
        }
      },
      // đếm số blog
      {
        $addFields: {
          blogs_count: { $size: '$blogs' }
        }
      },
      // bỏ password
      {
        $project: {
          password: 0
        }
      }
    ])
    return user
  }
  async deleteUserByIdService(user_id: string) {
    const user = await UserModel.findById(user_id)
    if (user) {
      // xóa refresh token của user
      await RefreshTokenModel.deleteMany({ user_id })
      // xóa post và ảnh post của user
      const posts = await PostModel.find({ user_id })
      const post_ids = posts.map((post) => post._id)
      // xóa trên s3 để sau
      await ImagePostModel.deleteMany({ post_id: { $in: post_ids } })

      // xóa like và comment của của từng post
      await LikePostModel.deleteMany({ user_id })
      await LikePostModel.deleteMany({ post_id: { $in: post_ids } })
      // tìm comment con của comment của user
      const comments = await CommentPostModel.find({ user_id })
      const comment_ids = comments.map((comment) => comment._id)
      console.log(comment_ids)
      await CommentPostModel.deleteMany({ parent_comment_id: { $in: comment_ids } })
      await CommentPostModel.deleteMany({ user_id })
      await CommentPostModel.deleteMany({ post_id: { $in: post_ids } })

      // lấy các post con của post của user
      const shared_posts = await PostModel.find({ parent_id: { $in: post_ids } })
      const shared_post_ids = shared_posts.map((post) => post._id)
      // xóa like và comment của của từng post
      await LikePostModel.deleteMany({ post_id: { $in: shared_post_ids } })
      await CommentPostModel.deleteMany({ post_id: { $in: shared_post_ids } })
      // xóa shared post
      await PostModel.deleteMany({ parent_id: { $in: post_ids } })
      await PostModel.deleteMany({ user_id })
      // xóa follow của user
      await FollowModel.deleteMany({ user_id })
      await FollowModel.deleteMany({ follow_id: user_id })

      // tìm album của user
      const albums = await AlbumModel.find({ user_id })
      const album_ids = albums.map((album) => album._id)
      // xóa bookmark của Album
      await BookmarkAlbumModel.deleteMany({ album_id: { $in: album_ids } })
      await BookmarkAlbumModel.deleteMany({ user_id })
      // xóa album
      await AlbumModel.deleteMany({ user_id })

      // tìm blog của user
      const blogs = await BlogModel.find({ user_id })
      const blog_ids = blogs.map((blog) => blog._id)
      // xóa comment của blog
      await CommentBlogModel.deleteMany({ blog_id: { $in: blog_ids } })
      await CommentBlogModel.deleteMany({ user_id })
      // xóa blog
      await BlogModel.deleteMany({ user_id })

      // tìm recipe của user
      const recipes = await RecipeModel.find({ user_id })
      const recipe_ids = recipes.map((recipe) => recipe._id)

      // xóa bookmark, like, comment của recipe
      await LikeRecipeModel.deleteMany({ recipe_id: { $in: recipe_ids } })
      await LikeRecipeModel.deleteMany({ user_id })
      await CommentRecipeModel.deleteMany({ recipe_id: { $in: recipe_ids } })
      await CommentRecipeModel.deleteMany({ user_id })
      await BookmarkRecipeModel.deleteMany({ recipe_id: { $in: recipe_ids } })
      await BookmarkRecipeModel.deleteMany({ user_id })
      // xóa recipe
      await RecipeModel.deleteMany({ user_id })

      // xóa lịch trình ăn uống của user
      const meal_schedules = await MealScheduleModel.find({ user_id })
      const meal_schedule_ids = meal_schedules.map((meal_schedule) => meal_schedule._id)

      //xóa item trong lịch trình ăn uống
      await MealItemModel.deleteMany({ meal_schedule_id: { $in: meal_schedule_ids } })
      // xóa lịch trình ăn uống
      await MealScheduleModel.deleteMany({ user_id })

      // xóa lịch trình tập luyện của user
      const workout_schedules = await WorkoutScheduleModel.find({ user_id })
      const workout_schedule_ids = workout_schedules.map((workout_schedule) => workout_schedule._id)
      // xóa item trong lịch trình tập luyện

      await WorkoutItemModel.deleteMany({ workout_schedule_id: { $in: workout_schedule_ids } })
      // xóa lịch trình tập luyện
      await WorkoutScheduleModel.deleteMany({ user_id })

      // xóa user
      await UserModel.findByIdAndDelete(user_id)
      return true
    }
  }
  async banUserByIdService(user_id: string) {
    const user = await UserModel.findById(user_id)
    if (user) {
      // xóa refresh token của user
      await RefreshTokenModel.deleteMany({ user_id })

      // xóa post và ảnh post của user
      const posts = await PostModel.find({ user_id })
      const post_ids = posts.map((post) => post._id)

      // xóa like và comment của của từng post
      await LikePostModel.deleteMany({ user_id })
      await LikePostModel.deleteMany({ post_id: { $in: post_ids } })
      // tìm comment con của comment của user
      const comments = await CommentPostModel.find({ user_id })
      const comment_ids = comments.map((comment) => comment._id)
      console.log(comment_ids)
      await CommentPostModel.updateMany({ parent_comment_id: { $in: comment_ids } }, { is_banned: true })
      await CommentPostModel.updateMany({ user_id }, { is_banned: true })
      await CommentPostModel.updateMany({ post_id: { $in: post_ids } }, { is_banned: true })

      // lấy các post con của post của user
      const shared_posts = await PostModel.find({ parent_id: { $in: post_ids } })
      const shared_post_ids = shared_posts.map((post) => post._id)
      // xóa like và comment của của từng post
      await LikePostModel.deleteMany({ post_id: { $in: shared_post_ids } })
      await CommentPostModel.updateMany({ post_id: { $in: shared_post_ids } }, { is_banned: true })
      // xóa shared post
      await PostModel.updateMany({ parent_id: { $in: post_ids } }, { is_banned: true })
      await PostModel.updateMany({ user_id }, { is_banned: true })

      // tìm album của user
      // const albums = await AlbumModel.find({ user_id })
      // const album_ids = albums.map((album) => album._id)
      // // xóa bookmark của Album
      // await BookmarkAlbumModel.deleteMany({ album_id: { $in: album_ids } })
      // await BookmarkAlbumModel.deleteMany({ user_id })
      // xóa album
      // await AlbumModel.updateMany({ user_id }, { status: AlbumStatus.banned })

      // tìm blog của user
      const blogs = await BlogModel.find({ user_id })
      const blog_ids = blogs.map((blog) => blog._id)
      // xóa comment của blog
      await CommentBlogModel.updateMany({ blog_id: { $in: blog_ids } }, { is_banned: true })
      await CommentBlogModel.updateMany({ user_id }, { is_banned: true })
      // xóa blog
      // await BlogModel.updateMany({ user_id }, { status: BlogStatus.banned })

      // tìm recipe của user
      const recipes = await RecipeModel.find({ user_id })
      const recipe_ids = recipes.map((recipe) => recipe._id)

      // xóa bookmark, like, comment của recipe
      await LikeRecipeModel.deleteMany({ recipe_id: { $in: recipe_ids } })
      await LikeRecipeModel.deleteMany({ user_id })
      await CommentRecipeModel.updateMany({ recipe_id: { $in: recipe_ids } }, { is_banned: true })
      await CommentRecipeModel.updateMany({ user_id }, { is_banned: true })
      // await BookmarkRecipeModel.deleteMany({ recipe_id: { $in: recipe_ids } })
      // await BookmarkRecipeModel.deleteMany({ user_id })
      // xóa recipe
      // await RecipeModel.updateMany({ user_id }, { status: RecipeStatus.banned })

      await UserModel.updateOne({ _id: user_id }, { status: UserStatus.banned })

      return true
    }
  }
  async unbanUserByIdService(user_id: string) {
    const user = await UserModel.findById(user_id)
    if (user) {
      // xóa post và ảnh post của user
      const posts = await PostModel.find({ user_id })
      const post_ids = posts.map((post) => post._id)

      // tìm comment con của comment của user
      const comments = await CommentPostModel.find({ user_id })
      const comment_ids = comments.map((comment) => comment._id)
      console.log(comment_ids)
      await CommentPostModel.updateMany({ parent_comment_id: { $in: comment_ids } }, { is_banned: false })
      await CommentPostModel.updateMany({ user_id }, { is_banned: false })
      await CommentPostModel.updateMany({ post_id: { $in: post_ids } }, { is_banned: false })

      // lấy các post con của post của user
      const shared_posts = await PostModel.find({ parent_id: { $in: post_ids } })
      const shared_post_ids = shared_posts.map((post) => post._id)
      // xóa like và comment của của từng post

      await CommentPostModel.updateMany({ post_id: { $in: shared_post_ids } }, { is_banned: false })
      // xóa shared post
      await PostModel.updateMany({ parent_id: { $in: post_ids } }, { is_banned: false })
      await PostModel.updateMany({ user_id }, { is_banned: false })

      // tìm album của user
      // const albums = await AlbumModel.find({ user_id })
      // const album_ids = albums.map((album) => album._id)
      // // xóa bookmark của Album
      // await BookmarkAlbumModel.deleteMany({ album_id: { $in: album_ids } })
      // await BookmarkAlbumModel.deleteMany({ user_id })
      // xóa album
      // await AlbumModel.updateMany({ user_id }, { status: AlbumStatus.accepted })

      // tìm blog của user
      const blogs = await BlogModel.find({ user_id })
      const blog_ids = blogs.map((blog) => blog._id)
      // xóa comment của blog
      await CommentBlogModel.updateMany({ blog_id: { $in: blog_ids } }, { is_banned: false })
      await CommentBlogModel.updateMany({ user_id }, { is_banned: false })
      // xóa blog
      // await BlogModel.updateMany({ user_id }, { status: BlogStatus.accepted })

      // tìm recipe của user
      const recipes = await RecipeModel.find({ user_id })
      const recipe_ids = recipes.map((recipe) => recipe._id)

      // xóa bookmark, like, comment của recipe
      await CommentRecipeModel.updateMany({ recipe_id: { $in: recipe_ids } }, { is_banned: false })
      await CommentRecipeModel.updateMany({ user_id }, { is_banned: false })
      // await BookmarkRecipeModel.deleteMany({ recipe_id: { $in: recipe_ids } })
      // await BookmarkRecipeModel.deleteMany({ user_id })
      // xóa recipe
      // await RecipeModel.updateMany({ user_id }, { status: RecipeStatus.accepted })

      await UserModel.updateOne({ _id: user_id }, { status: UserStatus.active })

      return true
    }
  }
  async checkEmailExist(email: string) {
    const user = await UserModel.findOne({ email })
    return Boolean(user)
  }
  async checkUserNameExist(user_name: string) {
    const user = await UserModel.findOne({ user_name })
    return Boolean(user)
  }
  async createWritterAndInspectorService({ name, email, user_name, role }: CreateUserAdminBody) {
    const password = '123456789Dd@'
    const hashedPassword = await hashPassword(password)
    const user = await UserModel.create({ name, email, user_name, password: hashedPassword, role })
    const newUser = omit(user.toObject(), ['password'])
    return newUser
  }
  async getRequestUpgradeService({
    type,
    page,
    limit,
    search
  }: {
    type: number
    page: number
    limit: number
    search: string
  }) {
    console.log('type', type)
    if (!type) {
      type = RequestType.follow
    }
    if (!page) {
      page = 1
    }
    if (!limit) {
      limit = 10
    }
    const condition: any = {
      role: UserRoles.user
    }
    condition['upgrade_request.type'] = type
    console.log('condition', condition)
    if (search) {
      condition.$text = { $search: search }
    }

    const users = await UserModel.find(condition)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)

    const total = await UserModel.countDocuments(condition)
    const totalPage = Math.ceil(total / limit)

    return {
      users,
      limit,
      page,
      totalPage
    }
  }
  async rejectRequestUpgradeService(user_id: string) {
    const user = await UserModel.findByIdAndUpdate(
      user_id,
      {
        upgrade_request: {
          reason: null,
          proof: null,
          type: null
        }
      },
      { new: true }
    )
    // gửi email thông báo
    if (user) {
      await sendRejectEmailNodeMailer(user.email, user.name)
    }

    return user
  }
  async acceptRequestUpgradeService(user_id: string) {
    const user = await UserModel.findByIdAndUpdate(
      user_id,
      {
        role: UserRoles.chef,
        upgrade_request: {
          reason: null,
          proof: null,
          type: null
        }
      },
      { new: true }
    )
    if (user) {
      //xóa refresh token của user
      await RefreshTokenModel.deleteMany({ user_id })
      await sendAcceptEmailNodeMailer(user.email, user.name)
    }
    return user
  }
  async dashboardService() {
    // lấy số lượng user có role là user, số lượng user có role là writter, số lượng user có role là inspector, số lượng user có role là chef
    const [user, writter, inspector, chef] = await Promise.all([
      UserModel.countDocuments({ role: UserRoles.user }),
      UserModel.countDocuments({ role: UserRoles.writter }),
      UserModel.countDocuments({ role: UserRoles.inspector }),
      UserModel.countDocuments({ role: UserRoles.chef })
    ])
    // lấy số lượng user đang active có role là user, số lượng user đang active có role là writter, số lượng user đang active có role là inspector, số lượng user đang active có role là chef
    const [activeUser, activeWritter, activeInspector, activeChef] = await Promise.all([
      UserModel.countDocuments({ role: UserRoles.user, status: UserStatus.active }),
      UserModel.countDocuments({ role: UserRoles.writter, status: UserStatus.active }),
      UserModel.countDocuments({ role: UserRoles.inspector, status: UserStatus.active }),
      UserModel.countDocuments({ role: UserRoles.chef, status: UserStatus.active })
    ])

    // lấy số lượng công thức đang active, số lượng công thức đang pending, số lượng công thức bị reject
    const [activeRecipe, pendingRecipe, rejectRecipe] = await Promise.all([
      RecipeModel.countDocuments({ status: RecipeStatus.accepted }),
      RecipeModel.countDocuments({ status: RecipeStatus.pending }),
      RecipeModel.countDocuments({ status: RecipeStatus.rejected })
    ])

    // lấy số lương album đang active, số lượng album đang pending, số lượng album bị reject
    const [activeAlbum, pendingAlbum, rejectAlbum] = await Promise.all([
      AlbumModel.countDocuments({ status: AlbumStatus.accepted }),
      AlbumModel.countDocuments({ status: AlbumStatus.pending }),
      AlbumModel.countDocuments({ status: AlbumStatus.rejected })
    ])

    // lấy số lượng blog đang active, số lượng blog đang pending, số lượng blog bị reject
    const [activeBlog, pendingBlog, rejectBlog] = await Promise.all([
      BlogModel.countDocuments({ status: BlogStatus.accepted }),
      BlogModel.countDocuments({ status: BlogStatus.pending }),
      BlogModel.countDocuments({ status: BlogStatus.rejected })
    ])

    // lấy số lượng post đăng theo 10 ngày gần nhất
    const posts = await PostModel.aggregate([
      {
        $match: {
          createdAt: {
            $gte: new Date(new Date().setDate(new Date().getDate() - 10))
          }
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { _id: 1 }
      }
    ])

    const users = await UserModel.aggregate([
      {
        $match: {
          BMI: { $ne: null }
        }
      },
      {
        $project: {
          name: 1,
          BMI: 1
        }
      }
    ])
    // tính tổng số lượng người có BMI
    const underWeight = users.filter((user) => user.BMI < 18.5).length
    const normal = users.filter((user) => user.BMI >= 18.5 && user.BMI < 24.9).length
    const overWeight = users.filter((user) => user.BMI >= 25 && user.BMI < 29.9).length
    const obesity = users.filter((user) => user.BMI >= 30).length

    // tính tổng users

    const totalUser = users.length

    return {
      account: {
        users: {
          total: user,
          active: activeUser
        },
        writters: {
          total: writter,
          active: activeWritter
        },
        inspectors: {
          total: inspector,
          active: activeInspector
        },
        chefs: {
          total: chef,
          active: activeChef
        }
      },
      food: {
        recipes: {
          total: activeRecipe,
          pending: pendingRecipe,
          reject: rejectRecipe
        },
        albums: {
          total: activeAlbum,
          pending: pendingAlbum,
          reject: rejectAlbum
        },
        blogs: {
          total: activeBlog,
          pending: pendingBlog,
          reject: rejectBlog
        }
      },
      posts,
      usersBMI: {
        total: totalUser,
        underWeight,
        normal,
        overWeight,
        obesity
      }
    }
  }
}

const userAdminService = new UserAdminService()
export default userAdminService
