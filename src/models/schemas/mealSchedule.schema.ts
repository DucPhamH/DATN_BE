import mongoose, { Types } from 'mongoose'
import { PurposeValue } from '~/constants/enums'

export interface MealSchedule {
  user_id: Types.ObjectId
  name: string
  total_calo?: number
  total_protein?: number
  total_fat?: number
  total_carb?: number
  weight_target?: number
  purpose: PurposeValue
  start_date: Date
  end_date: Date
}

const MealScheduleSchema = new mongoose.Schema<MealSchedule>(
  {
    user_id: { type: mongoose.SchemaTypes.ObjectId, ref: 'users', required: true },
    name: { type: String, default: '', required: true, index: true },
    total_calo: { type: Number, default: 0 },
    total_protein: { type: Number, default: 0 },
    total_fat: { type: Number, default: 0 },
    total_carb: { type: Number, default: 0 },
    weight_target: { type: Number, default: 0 },
    purpose: { type: Number, required: true },
    start_date: { type: Date, required: true },
    end_date: { type: Date, required: true }
  },
  {
    timestamps: true,
    collection: 'meal_schedules'
  }
)

const MealScheduleModel = mongoose.model('meal_schedules', MealScheduleSchema)

export default MealScheduleModel
