import mongoose, { Types } from 'mongoose'

export interface Ingerdients {
  name: string
  energy: number
  protein: number
  fat: number
  carbohydrate: number
  ingerdient_category_ID: Types.ObjectId
}
const IngerdientSchema = new mongoose.Schema<Ingerdients>(
  {
    name: { type: String, default: '', required: true, index: true },
    energy: { type: Number, default: 0 },
    protein: { type: Number, default: 0 },
    fat: { type: Number, default: 0 },
    carbohydrate: { type: Number, default: 0 },
    ingerdient_category_ID: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'ingerdient_categories',
      required: true
    }
  },
  {
    collection: 'ingerdients'
  }
)

const IngerdientModel = mongoose.model('ingerdients', IngerdientSchema)

export default IngerdientModel
