import axios from 'axios'
import { ObjectId } from 'mongodb'
import sharp from 'sharp'
import { RecipeStatus, RecipeTime, RecipeType } from '~/constants/enums'
import HTTP_STATUS from '~/constants/httpStatus'
import { RECIPE_MESSAGE } from '~/constants/messages'
import {
  CreateIngredientBody,
  CreateRecipeForWritterBody,
  GetListRecipeForWritterQuery,
  UpdateRecipeForWritterBody
} from '~/models/requests/writter.request'
import BookmarkRecipeModel from '~/models/schemas/bookmarkRecipe.schema'
import CommentRecipeModel from '~/models/schemas/commentRecipe.schema'
import IngredientModel from '~/models/schemas/ingredient.schema'
import LikeRecipeModel from '~/models/schemas/likeRecipe.schema'
import RecipeModel from '~/models/schemas/recipe.schema'
import { ErrorWithStatus } from '~/utils/error'
import { trainRecipesRecommender } from '~/utils/recommend'
import { deleteFileFromS3, uploadFileToS3 } from '~/utils/s3'

class WritterService {
  async createIngredientService({
    name,
    energy,
    protein,
    fat,
    carbohydrate,
    ingredient_category_ID
  }: CreateIngredientBody) {
    const ingredient = await IngredientModel.create({
      name,
      energy,
      protein,
      fat,
      carbohydrate,
      ingredient_category_ID
    })
    return ingredient
  }
  async deleteIngredientService({ ingredient_id }: { ingredient_id: string }) {
    await IngredientModel.findOneAndDelete({ _id: new ObjectId(ingredient_id) })
    return true
  }
  async createRecipeForWritterService({
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
    processing_food,
    energy,
    protein,
    fat,
    carbohydrate,
    unit,
    quantity,
    ingredients
  }: CreateRecipeForWritterBody) {
    const newImage = {
      ...image,
      originalname: image?.originalname.split('.')[0] + new Date().getTime() + '.' + image?.originalname.split('.')[1],
      buffer: await sharp(image?.buffer as Buffer)
        .jpeg()
        .toBuffer()
    }
    // console.log(ingredients)

    const uploadRes = await uploadFileToS3({
      filename: `recipe/${newImage?.originalname}` as string,
      contentType: newImage?.mimetype as string,
      body: newImage?.buffer as Buffer
    })
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
      image: uploadRes.Location,
      image_name: image_name,
      video,
      time,
      region,
      difficult_level,
      category_recipe_id,
      processing_food,
      energy,
      protein,
      fat,
      carbohydrate,
      unit,
      quantity,
      status: RecipeStatus.accepted,
      // ingredients là 1 mảng, mỗi phần tử là 1 object chứa các trường name, energy, protein, fat, carbohydrate
      // push vào mảng ingredients của recipe
      ingredients,
      type: RecipeType.writter
    })

    // 'https://media.cooky.vn/recipe/g2/18978/s/recipe18978-prepare-step4-636228324350426949.jpg'
    // const body = {
    //   image: newRecipe.image,
    //   image_name: newRecipe.image_name
    // }

    // // https://cookhealthyimage.io.vn/create-img
    // // http://127.0.0.1:5000/create-img
    // const { data } = await axios.post('https://cookhealthyimage.io.vn/create-img', body, {
    //   headers: {
    //     'Content-Type': 'application/json'
    //   }
    // })

    // console.log(data)
    await trainRecipesRecommender()
    return newRecipe
  }
  async updateRecipeForWritterService({
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
    processing_food,
    energy,
    protein,
    fat,
    carbohydrate,
    unit,
    quantity,
    ingredients
  }: UpdateRecipeForWritterBody) {
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

    if (isNaN(Number(energy))) {
      energy = recipe.energy
    }

    if (isNaN(Number(protein))) {
      protein = recipe.protein
    }

    if (isNaN(Number(fat))) {
      fat = recipe.fat
    }

    if (isNaN(Number(carbohydrate))) {
      carbohydrate = recipe.carbohydrate
    }

    if (!unit) {
      unit = recipe.unit
    }

    if (isNaN(Number(quantity))) {
      quantity = recipe.quantity
    }

    console.log(ingredients)

    // nếu ingredients là mảng rỗng thì gán ingredients = recipe.ingredients
    if (ingredients?.length === 0 || !ingredients) {
      ingredients = recipe.ingredients
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

      const uploadRes = await uploadFileToS3({
        filename: `recipe/${newImage?.originalname}` as string,
        contentType: newImage?.mimetype as string,
        body: newImage?.buffer as Buffer
      })

      // // xóa anhr cũ trên S3
      const old_image_name = recipe.image_name + '.' + recipe.image.split('.').pop()
      console.log('old_image_name', old_image_name)

      await deleteFileFromS3(`recipe/${old_image_name}`)

      const image_name = newImage.originalname.split('.')[0]

      const newRecipe = await RecipeModel.findOneAndUpdate(
        {
          _id: new ObjectId(recipe_id),
          user_id: new ObjectId(user_id)
        },
        {
          $set: {
            title,
            description,
            content,
            image: uploadRes.Location,
            image_name,
            video,
            time,
            region,
            difficult_level,
            category_recipe_id,
            processing_food,
            energy,
            protein,
            fat,
            carbohydrate,
            unit,
            quantity,
            ingredients: ingredients
          }
        },
        { new: true }
      )

      // // 'https://media.cooky.vn/recipe/g2/18978/s/recipe18978-prepare-step4-636228324350426949.jpg'
      // const body = {
      //   image: uploadRes.Location,
      //   image_name: image_name,
      //   old_image_name: recipe.image_name
      // }

      // // https://cookhealthyimage.io.vn/update-img
      // // http://127.0.0.1:5000/update-img
      // const { data } = await axios.post('https://cookhealthyimage.io.vn/update-img', body, {
      //   headers: {
      //     'Content-Type': 'application/json'
      //   }
      // })

      // console.log(data)

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
        energy,
        protein,
        fat,
        carbohydrate,
        unit,
        quantity,
        // xóa trường ingredients cũ và thêm trường ingredients mới
        ingredients
      },
      { new: true }
    )

    return newRecipe
  }
  async getListRecipesForWritterService({
    user_id,
    page,
    limit,
    sort,
    search,
    category_recipe_id,
    difficult_level,
    processing_food,
    region,
    interval_time
  }: GetListRecipeForWritterQuery) {
    const condition: any = {
      user_id: new ObjectId(user_id),
      // không lấy những blog bị banned
      status: { $ne: RecipeStatus.banned },
      // lấy những bài viết có album_id = null
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
        $project: {
          content: 0
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
  async getRecipeForWritterService({ user_id, recipe_id }: { user_id: string; recipe_id: string }) {
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
  async deteleRecipeForWritterService({ user_id, recipe_id }: { user_id: string; recipe_id: string }) {
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

    // xóa ảnh trên S3
    const image_name = recipe.image_name + '.' + recipe.image.split('.').pop()
    await deleteFileFromS3(`recipe/${image_name}`)

    // 'https://media.cooky.vn/recipe/g2/18978/s/recipe18978-prepare-step4-636228324350426949.jpg'
    // const body = {
    //   image_name: recipe.image_name
    // }

    // // https://cookhealthyimage.io.vn/delete-img
    // // http://127.0.0.1:5000/delete-img
    // const { data } = await axios.post('https://cookhealthyimage.io.vn/delete-img', body, {
    //   headers: {
    //     'Content-Type': 'application/json'
    //   }
    // })

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
}

const writterService = new WritterService()
export default writterService
