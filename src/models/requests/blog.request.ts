export interface CreateBlogBody {
  title: string
  content: string
  description: string
  image: string
  user_id: string
  category_blog_id: string
}

export interface GetListBlogForChefQuery {
  user_id: string
  page?: number
  limit?: number
  sort?: string
  status?: string
  search?: string
  category_blog_id?: string
}

export interface GetListBlogForUserQuery {
  user_id: string
  page?: number
  limit?: number
  sort?: string
  search?: string
  category_blog_id?: string
}

export interface UpdateBlogForChefBody {
  user_id: string
  blog_id: string
  title?: string
  content?: string
  description?: string
  image?: string
  category_blog_id?: string
}
