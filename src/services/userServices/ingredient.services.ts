import { GetListIngredientQuery } from '~/models/requests/ingredient.request'
import IngredientModel from '~/models/schemas/ingredient.schema'
import IngredientCategoryModel from '~/models/schemas/ingredientCategory.schema'

class IngredientServices {
  async getAllCategoryIngredientsService() {
    const categoryIngredients = await IngredientCategoryModel.find()
    return categoryIngredients
  }
  async getListIngerdientService({ page, limit, search, ingredient_category_ID }: GetListIngredientQuery) {
    const condition: any = {}

    if (search !== undefined) {
      condition.$text = { $search: search }
    }

    if (ingredient_category_ID !== undefined) {
      condition.ingredient_category_ID = ingredient_category_ID
    }

    if (!page) {
      page = 1
    }

    if (!limit) {
      limit = 10
    }

    const ingredients = await IngredientModel.find(condition)
      .skip((page - 1) * limit)
      .limit(limit)

    const totalPage = Math.ceil((await IngredientModel.find(condition)).length / limit)

    return { ingredients, totalPage, page, limit }
  }
}

const ingredientServices = new IngredientServices()
export default ingredientServices
