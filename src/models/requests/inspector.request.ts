export interface GetListBlogForInspectorQuery {
  page?: number
  limit?: number
  sort?: string
  search?: string
  category_blog_id?: string
}

export interface GetListRecipeForInspectorQuery {
  page?: number
  limit?: number
  sort?: string
  search?: string
  category_recipe_id?: string
  difficult_level?: number
  processing_food?: string
  region?: number
  interval_time?: number
}

export interface GetListAlbumForInspectorQuery {
  page?: number
  limit?: number
  sort?: string
  search?: string
  category_album?: string
}
