import mongoose from 'mongoose'

export interface IngredientCategory {
  name: string
}
const IngredientCategorySchema = new mongoose.Schema<IngredientCategory>(
  {
    name: { type: String, default: '', required: true, index: true }
  },
  {
    collection: 'ingredient_categories'
  }
)

const IngredientCategoryModel = mongoose.model('ingredient_categories', IngredientCategorySchema)

export default IngredientCategoryModel
