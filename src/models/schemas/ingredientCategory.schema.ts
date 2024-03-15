import mongoose from 'mongoose'

export interface IngerdientCategories {
  name: string
}
const IngerdientCategorySchema = new mongoose.Schema<IngerdientCategories>(
  {
    name: { type: String, default: '', required: true, index: true }
  },
  {
    timestamps: true,
    collection: 'ingerdient_categories'
  }
)

const IngerdientCategoryModel = mongoose.model('ingerdient_categories', IngerdientCategorySchema)

export default IngerdientCategoryModel
