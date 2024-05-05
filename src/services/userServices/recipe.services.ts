import { ObjectId } from 'mongodb'
import sharp from 'sharp'
import { RecipeStatus, RecipeTime } from '~/constants/enums'
import { CreateRecipeBody, GetListRecipeForChefQuery, UpdateRecipeBody } from '~/models/requests/recipe.request'
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
      condition.search_fields = { $regex: search, $options: 'i' }
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
        message: 'Recipe not found',
        status: 404
      })
    }

    // nếu time là NaN thì gán time = time cũ
    if (isNaN(Number(time))) {
      time = recipe.time
    }

    if (isNaN(Number(region))) {
      region = recipe.region
    }

    if (isNaN(Number(difficult_level))) {
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
}

const recipeService = new RecipeService()

export default recipeService
