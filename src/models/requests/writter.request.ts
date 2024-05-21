export interface CreateIngredientBody {
  name: string
  energy: number
  protein: number
  fat: number
  carbohydrate: number
  ingredient_category_ID: string
}

export interface GetListRecipeForWritterQuery {
  page?: number
  limit?: number
  sort?: string
  search?: string
  category_recipe_id?: string
  difficult_level?: number
  processing_food?: string
  region?: number
  interval_time?: number
  user_id: string
}

// user_id,
// title,
// description,
// content,
// image,
// video = '',
// time,
// region,
// difficult_level,
// category_recipe_id,
// processing_food,
// energy,
// protein,
// fat,
// carbohydrate,
// unit,
// quantity,
// array_ingredients

export interface CreateRecipeForWritterBody {
  user_id: string
  title: string
  description: string
  content: string
  image: any
  video?: string
  time: number
  region: number
  difficult_level: number
  category_recipe_id: string
  processing_food: string
  energy: number
  protein: number
  fat: number
  carbohydrate: number
  unit: string
  quantity: number
  ingredients: {
    name: string
    energy: number
    protein: number
    fat: number
    carbohydrate: number
  }[]
}

export interface UpdateRecipeForWritterBody {
  user_id: string
  recipe_id: string
  title?: string
  description?: string
  content: string
  image?: any
  video?: string
  time?: number
  region?: number
  difficult_level?: number
  category_recipe_id?: string
  processing_food?: string
  energy?: number
  protein?: number
  fat?: number
  carbohydrate?: number
  unit?: string
  quantity?: number
  ingredients?: {
    name: string
    energy: number
    protein: number
    fat: number
    carbohydrate: number
  }[]
}
