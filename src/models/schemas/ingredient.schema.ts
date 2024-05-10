import mongoose, { Types } from 'mongoose'

export interface Ingredient {
  name: string
  energy: number
  protein: number
  fat: number
  carbohydrate: number
  ingredient_category_ID: Types.ObjectId
}
const IngredientSchema = new mongoose.Schema<Ingredient>(
  {
    name: { type: String, default: '', required: true, index: true },
    energy: { type: Number, default: 0 },
    protein: { type: Number, default: 0 },
    fat: { type: Number, default: 0 },
    carbohydrate: { type: Number, default: 0 },
    ingredient_category_ID: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'ingredient_categories',
      required: true
    }
  },
  {
    collection: 'ingredients'
  }
)

const IngredientModel = mongoose.model('ingredients', IngredientSchema)

export default IngredientModel
