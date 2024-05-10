import mongoose, { Types } from 'mongoose'

export interface MealItem {
  meal_schedule_id: Types.ObjectId
  meal_name: string
  quantity: number
  unit: string
  energy: number
  protein: number
  fat: number
  carb: number
  current_date: Date
  is_completed?: boolean
}

const MealItemSchema = new mongoose.Schema<MealItem>(
  {
    meal_schedule_id: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'meal_schedules',
      required: true
    },
    meal_name: {
      type: String,
      required: true
    },
    quantity: {
      type: Number,
      required: true
    },
    unit: {
      type: String,
      required: true
    },
    energy: {
      type: Number,
      required: true
    },
    protein: {
      type: Number,
      required: true
    },
    fat: {
      type: Number,
      required: true
    },
    carb: {
      type: Number,
      required: true
    },
    current_date: {
      type: Date,
      required: true
    },
    is_completed: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true,
    collection: 'meal_items'
  }
)

const MealItemModel = mongoose.model('meal_items', MealItemSchema)

export default MealItemModel
