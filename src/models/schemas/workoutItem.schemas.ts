import mongoose, { Types } from 'mongoose'

export interface WorkoutItem {
  workout_schedule_id: Types.ObjectId
  activity_name: string
  time: number
  met: number
  current_date: Date
  calo_burn?: number
  is_completed?: boolean
}

const WorkoutItemSchema = new mongoose.Schema<WorkoutItem>(
  {
    workout_schedule_id: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'workout_schedules',
      required: true
    },
    activity_name: {
      type: String,
      required: true
    },
    time: {
      type: Number,
      required: true
    },
    met: {
      type: Number,
      required: true
    },
    current_date: {
      type: Date,
      required: true
    },
    calo_burn: {
      type: Number,
      default: 0
    },
    is_completed: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true,
    collection: 'workout_items'
  }
)

const WorkoutItemModel = mongoose.model('workout_items', WorkoutItemSchema)

export default WorkoutItemModel
