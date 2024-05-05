export interface CreateAlbumBody {
  title: string
  description: string
  image: string
  user_id: string
  category_album: string
  array_recipes_id: string[]
}

export interface GetListAlbumForChefQuery {
  user_id: string
  page?: number
  limit?: number
  sort?: string
  status?: string
  search?: string
  category_album?: string
}
