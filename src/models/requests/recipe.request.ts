export interface CreateRecipeBody {
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
  user_id: string
}

export interface UpdateRecipeBody {
  title?: string
  description?: string
  content?: string
  image?: any
  video?: string
  time?: number
  region?: number
  difficult_level?: number
  category_recipe_id?: string
  processing_food?: string
  user_id: string
  recipe_id: string
}

export interface GetListRecipeForChefQuery {
  user_id: string
  page?: number
  limit?: number
  sort?: string
  status?: string
  search?: string
  category_recipe_id?: string
  difficult_level?: number
  processing_food?: string
  region?: number
  interval_time?: number
}

export interface GetListRecipeForUserQuery {
  user_id: string
  page?: number
  limit?: number
  sort?: string
  search?: string
  category_recipe_id?: string
  difficult_level?: number
  processing_food?: string
  region?: number
  interval_time?: number
  type?: number
}
