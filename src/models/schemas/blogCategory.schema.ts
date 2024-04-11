import mongoose from 'mongoose'

export interface BlogCategory {
  name: string
}

const BlogCategorySchema = new mongoose.Schema<BlogCategory>(
  {
    name: { type: String, default: '' }
  },
  {
    collection: 'category_blogs'
  }
)

const BlogCategoryModel = mongoose.model('category_blogs', BlogCategorySchema)

export default BlogCategoryModel
