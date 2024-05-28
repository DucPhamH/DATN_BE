import axios from 'axios'
import { body } from 'express-validator'
import { ObjectId } from 'mongodb'
import sharp from 'sharp'
import { RecipeStatus, RecipeTime } from '~/constants/enums'
import HTTP_STATUS from '~/constants/httpStatus'
import { RECIPE_MESSAGE } from '~/constants/messages'
import {
  CreateRecipeBody,
  GetListRecipeForChefQuery,
  GetListRecipeForUserQuery,
  UpdateRecipeBody
} from '~/models/requests/recipe.request'
import BookmarkRecipeModel from '~/models/schemas/bookmarkRecipe.schema'
import CommentRecipeModel from '~/models/schemas/commentRecipe.schema'
import LikeRecipeModel from '~/models/schemas/likeRecipe.schema'
import RecipeModel from '~/models/schemas/recipe.schema'
import RecipeCategoryModel from '~/models/schemas/recipeCategory.schema'
import { ErrorWithStatus } from '~/utils/error'
import { deleteFileFromS3, uploadFileToS3 } from '~/utils/s3'

class RecipeService {
  async getAllRecipeCategoryService() {
    const recipeCategory = await RecipeCategoryModel.find().exec()
    return recipeCategory
  }
  async createRecipeService({
    user_id,
    title,
    description,
    content,
    image,
    video = '',
    time,
    region,
    difficult_level,
    category_recipe_id,
    processing_food
  }: CreateRecipeBody) {
    const newImage = {
      ...image,
      originalname: image?.originalname.split('.')[0] + new Date().getTime() + '.' + image?.originalname.split('.')[1],
      buffer: await sharp(image?.buffer as Buffer)
        .jpeg()
        .toBuffer()
    }

    // const uploadRes = await uploadFileToS3({
    //   filename: `recipe/${newImage?.originalname}` as string,
    //   contentType: newImage?.mimetype as string,
    //   body: newImage?.buffer as Buffer
    // })
    console.log(newImage)

    // lấy tên ảnh từ newImage.originalname

    const image_name = newImage.originalname.split('.')[0]

    console.log(image_name)

    //     url: 'https://bepvang.org.vn/Userfiles/Upload/images/Download/2017/2/24/268f41e9fdcd49999f327632ed207db1.jpg',

    const newRecipe = await RecipeModel.create({
      user_id,
      title,
      description,
      content,
      image: 'https://bepvang.org.vn/Userfiles/Upload/images/Download/2017/2/24/268f41e9fdcd49999f327632ed207db1.jpg',
      image_name: image_name,
      video,
      time,
      region,
      difficult_level,
      category_recipe_id,
      processing_food
    })

    // const body = {
    //   image: 'https://media.cooky.vn/recipe/g2/18978/s/recipe18978-prepare-step4-636228324350426949.jpg',
    //   image_name: newRecipe.image_name
    // }

    // const { data } = await axios.post('http://127.0.0.1:5000/create-img', body, {
    //   headers: {
    //     'Content-Type': 'application/json'
    //   }
    // })

    // console.log(data)

    return newRecipe
  }
  async getListRecipesForChefService({
    user_id,
    page,
    limit,
    sort,
    status,
    search,
    category_recipe_id,
    difficult_level,
    processing_food,
    region,
    interval_time
  }: GetListRecipeForChefQuery) {
    const condition: any = {
      user_id: new ObjectId(user_id),
      // không lấy những blog bị banned
      status: { $ne: RecipeStatus.banned },
      // lấy những bài viết có album_id = null
      album_id: null
    }

    console.log(sort)
    if (status) {
      condition.status = parseInt(status)
    }

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
  async getListRecipesForUserService({
    user_id,
    page,
    limit,
    sort,
    search,
    category_recipe_id,
    difficult_level,
    processing_food,
    region,
    interval_time,
    type
  }: GetListRecipeForUserQuery) {
    const condition: any = {
      status: RecipeStatus.accepted
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

    if (type || type === 0) {
      condition.type = type
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
          'user.password': 0
        }
      },
      // lookup tới bảng bookmark
      {
        $lookup: {
          from: 'bookmark_recipes',
          localField: '_id',
          foreignField: 'recipe_id',
          as: 'bookmarks'
        }
      },
      // // check xem user_id đã bookmark recipe_id chưa
      {
        $addFields: {
          is_bookmarked: {
            $in: [new ObjectId(user_id), '$bookmarks.user_id']
          }
        }
      },
      // đếm số lượt bookmark
      {
        $addFields: {
          total_bookmarks: { $size: '$bookmarks' }
        }
      },
      // nối bảng like
      {
        $lookup: {
          from: 'like_recipes',
          localField: '_id',
          foreignField: 'recipe_id',
          as: 'likes'
        }
      },
      // check xem user_id đã like recipe_id chưa
      {
        $addFields: {
          is_liked: {
            $in: [new ObjectId(user_id), '$likes.user_id']
          }
        }
      },
      // đếm số lượt like
      {
        $addFields: {
          total_likes: { $size: '$likes' }
        }
      },

      // nối bảng comment
      {
        $lookup: {
          from: 'comment_recipes',
          localField: '_id',
          foreignField: 'recipe_id',
          as: 'comments'
        }
      },
      // đếm số lượt comment
      {
        $addFields: {
          total_comments: { $size: '$comments' }
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
  async getRecipeForChefService({ user_id, recipe_id }: { user_id: string; recipe_id: string }) {
    const recipe = await RecipeModel.aggregate([
      {
        $match: {
          _id: new ObjectId(recipe_id),
          user_id: new ObjectId(user_id),
          album_id: null
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
      }
    ])

    return recipe
  }
  async getRecipeForUserService({ user_id, recipe_id }: { user_id: string; recipe_id: string }) {
    const recipe = await RecipeModel.aggregate([
      {
        $match: {
          _id: new ObjectId(recipe_id),
          status: RecipeStatus.accepted
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
      // lookup tới bảng bookmark
      {
        $lookup: {
          from: 'bookmark_recipes',
          localField: '_id',
          foreignField: 'recipe_id',
          as: 'bookmarks'
        }
      },
      // // check xem user_id đã bookmark recipe_id chưa
      {
        $addFields: {
          is_bookmarked: {
            $in: [new ObjectId(user_id), '$bookmarks.user_id']
          }
        }
      },
      // đếm số lượt bookmark
      {
        $addFields: {
          total_bookmarks: { $size: '$bookmarks' }
        }
      },
      // nối bảng like
      {
        $lookup: {
          from: 'like_recipes',
          localField: '_id',
          foreignField: 'recipe_id',
          as: 'likes'
        }
      },
      // check xem user_id đã like recipe_id chưa
      {
        $addFields: {
          is_liked: {
            $in: [new ObjectId(user_id), '$likes.user_id']
          }
        }
      },
      // đếm số lượt like
      {
        $addFields: {
          total_likes: { $size: '$likes' }
        }
      },

      // nối bảng comment
      {
        $lookup: {
          from: 'comment_recipes',
          localField: '_id',
          foreignField: 'recipe_id',
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
      // đếm số lượt comment
      {
        $addFields: {
          total_comments: { $size: '$comments' }
        }
      }
    ])

    // tăng user_view lên 1

    if (recipe[0]) {
      await RecipeModel.updateOne(
        {
          _id: new ObjectId(recipe_id)
        },
        {
          user_view: recipe[0].user_view + 1
        }
      )
    }

    return recipe
  }
  async updateRecipeForChefService({
    user_id,
    recipe_id,
    title,
    description,
    content,
    image,
    video,
    time,
    region,
    difficult_level,
    category_recipe_id,
    processing_food
  }: UpdateRecipeBody) {
    const recipe = await RecipeModel.findOne({
      _id: new ObjectId(recipe_id),
      user_id: new ObjectId(user_id)
    })

    if (!recipe) {
      throw new ErrorWithStatus({
        message: RECIPE_MESSAGE.RECIPE_NOT_FOUND,
        status: HTTP_STATUS.NOT_FOUND
      })
    }

    // nếu time là NaN thì gán time = time cũ
    if (isNaN(Number(time))) {
      console.log('time', time)
      time = recipe.time
    }

    if (isNaN(Number(region))) {
      region = recipe.region
    }

    if (isNaN(Number(difficult_level))) {
      console.log('difficult_level', difficult_level)
      difficult_level = recipe.difficult_level
    }

    console.log(image)
    // nếu có ảnh mới thì update ảnh mới và xóa ảnh cũ
    if (image) {
      console.log('co anh')
      const newImage = {
        ...image,
        originalname:
          image?.originalname.split('.')[0] + new Date().getTime() + '.' + image?.originalname.split('.')[1],
        buffer: await sharp(image?.buffer as Buffer)
          .jpeg()
          .toBuffer()
      }

      // const uploadRes = await uploadFileToS3({
      //   filename: `recipe/${newImage?.originalname}` as string,
      //   contentType: newImage?.mimetype as string,
      //   body: newImage?.buffer as Buffer
      // })

      // // xóa anhr cũ trên S3
      // const old_image_name = recipe.image_name + '.' + recipe.image.split('.').pop()

      // await deleteFileFromS3(`recipe/${old_image_name}`)

      const image_name = newImage.originalname.split('.')[0]

      const newRecipe = await RecipeModel.findOneAndUpdate(
        {
          _id: new ObjectId(recipe_id),
          user_id: new ObjectId(user_id)
        },
        {
          title,
          description,
          content,
          image:
            'https://bepvang.org.vn/Userfiles/Upload/images/Download/2017/2/24/268f41e9fdcd49999f327632ed207db1.jpg',
          image_name,
          video,
          time,
          region,
          difficult_level,
          category_recipe_id,
          processing_food,
          status: RecipeStatus.pending
        },
        { new: true }
      )

      return newRecipe
    }

    const newRecipe = await RecipeModel.findOneAndUpdate(
      {
        _id: new ObjectId(recipe_id),
        user_id: new ObjectId(user_id)
      },
      {
        title,
        description,
        content,
        video,
        time,
        region,
        difficult_level,
        category_recipe_id,
        processing_food,
        status: RecipeStatus.pending
      },
      { new: true }
    )

    return newRecipe
  }
  async likeRecipeService({ user_id, recipe_id }: { user_id: string; recipe_id: string }) {
    const newLike = await LikeRecipeModel.findOneAndUpdate(
      {
        user_id: new ObjectId(user_id),
        recipe_id: new ObjectId(recipe_id)
      },
      {
        user_id: new ObjectId(user_id),
        recipe_id: new ObjectId(recipe_id)
      },
      { upsert: true, new: true }
    )
    return newLike
  }
  async unlikeRecipeService({ user_id, recipe_id }: { user_id: string; recipe_id: string }) {
    const like = await LikeRecipeModel.findOneAndDelete({
      user_id: new ObjectId(user_id),
      recipe_id: new ObjectId(recipe_id)
    })
    return like
  }
  async createCommentRecipeService({
    user_id,
    recipe_id,
    content
  }: {
    user_id: string
    recipe_id: string
    content: string
  }) {
    const newComment = await CommentRecipeModel.create({
      user_id: new ObjectId(user_id),
      recipe_id: new ObjectId(recipe_id),
      content
    })
    return newComment
  }

  async deleteCommentRecipeService({ user_id, comment_id }: { user_id: string; comment_id: string }) {
    const comment = await CommentRecipeModel.findOneAndDelete({
      _id: new ObjectId(comment_id),
      user_id: new ObjectId(user_id)
    })

    return comment
  }

  async bookmarkRecipeService({ user_id, recipe_id }: { user_id: string; recipe_id: string }) {
    const newBookmark = await BookmarkRecipeModel.findOneAndUpdate(
      {
        user_id: new ObjectId(user_id),
        recipe_id: new ObjectId(recipe_id)
      },
      {
        user_id: new ObjectId(user_id),
        recipe_id: new ObjectId(recipe_id)
      },
      { upsert: true, new: true }
    )
    return newBookmark
  }

  async unbookmarkRecipeService({ user_id, recipe_id }: { user_id: string; recipe_id: string }) {
    const bookmark = await BookmarkRecipeModel.findOneAndDelete({
      user_id: new ObjectId(user_id),
      recipe_id: new ObjectId(recipe_id)
    })
    return bookmark
  }
  async getCommentRecipeService({ recipe_id, page, limit }: { recipe_id: string; page: number; limit: number }) {
    if (!limit) {
      limit = 3
    }
    if (!page) {
      page = 1
    }
    const comments = await CommentRecipeModel.aggregate([
      {
        $match: {
          recipe_id: new ObjectId(recipe_id),
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

    const findComments = await CommentRecipeModel.find({
      recipe_id: new ObjectId(recipe_id),
      is_banned: false
    })

    const totalPage = Math.ceil(findComments.length / limit)

    return {
      comments,
      totalPage,
      page,
      limit
    }
  }
  async deteleRecipeForChefService({ user_id, recipe_id }: { user_id: string; recipe_id: string }) {
    // xóa ảnh trên S3
    // const image_name = recipe.image_name + '.' + recipe.image.split('.').pop()
    // await deleteFileFromS3(`recipe/${image_name}`)
    console.log(recipe_id)

    await Promise.all([
      await RecipeModel.findOneAndDelete({
        _id: new ObjectId(recipe_id),
        user_id: new ObjectId(user_id)
      }),
      CommentRecipeModel.deleteMany({ recipe_id: new ObjectId(recipe_id) }),
      LikeRecipeModel.deleteMany({ recipe_id: new ObjectId(recipe_id) }),
      BookmarkRecipeModel.deleteMany({ recipe_id: new ObjectId(recipe_id) })
    ])

    return true
  }
  async getThreeTopRecipesService() {
    // lấy 3 bài viết có like, bookmark, view nhiều nhất
    const recipes = await RecipeModel.aggregate([
      {
        $lookup: {
          from: 'bookmark_recipes',
          localField: '_id',
          foreignField: 'recipe_id',
          as: 'bookmarks'
        }
      },
      // đếm số lượt bookmark
      {
        $addFields: {
          total_bookmarks: { $size: '$bookmarks' }
        }
      },
      // nối bảng like
      {
        $lookup: {
          from: 'like_recipes',
          localField: '_id',
          foreignField: 'recipe_id',
          as: 'likes'
        }
      },
      // đếm số lượt like
      {
        $addFields: {
          total_likes: { $size: '$likes' }
        }
      },
      {
        $sort: { total_likes: -1, total_bookmarks: -1 }
      },
      {
        $limit: 3
      }
    ])
    return recipes
  }
}

const recipeService = new RecipeService()

export default recipeService
