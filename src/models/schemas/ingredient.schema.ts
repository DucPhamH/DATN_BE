import mongoose, { Types } from 'mongoose'
import { IngerdientTypes } from '~/constants/enums'

export interface Ingerdients {
  name: string
  energy: number
  protein: number
  fat: number
  carbohydrate: number
  type: number // 0 la chua duyet, 1 la da duyet
  ingerdient_category_ID: Types.ObjectId
}
const IngerdientSchema = new mongoose.Schema<Ingerdients>(
  {
    name: { type: String, default: '', required: true, index: true },
    energy: { type: Number, default: 0 },
    protein: { type: Number, default: 0 },
    fat: { type: Number, default: 0 },
    carbohydrate: { type: Number, default: 0 },
    type: { type: Number, default: IngerdientTypes.accept },
    ingerdient_category_ID: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'ingerdient_categories',
      required: true
    }
  },
  {
    timestamps: true,
    collection: 'ingerdients'
  }
)

const IngerdientModel = mongoose.model('ingerdients', IngerdientSchema)

export default IngerdientModel
