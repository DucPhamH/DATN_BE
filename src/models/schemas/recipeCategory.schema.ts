import mongoose, { Types } from 'mongoose'

export interface RecipeCategory {
  name: string
}

const RecipeCategorySchema = new mongoose.Schema<RecipeCategory>(
  {
    name: { type: String, default: '' }
  },
  {
    collection: 'recipe_categories'
  }
)

const RecipeCategoryModel = mongoose.model('recipe_categories', RecipeCategorySchema)

export default RecipeCategoryModel
