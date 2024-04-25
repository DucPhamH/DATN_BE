import mongoose, { Types } from 'mongoose'

export interface WorkoutSchedule {
  user_id: Types.ObjectId
  name: string
  weight: number
  calo_target: number
  total_calo_burn?: number
  start_date: Date
  end_date: Date
}

const WorkoutScheduleSchema = new mongoose.Schema<WorkoutSchedule>(
  {
    user_id: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'users',
      required: true
    },
    name: {
      type: String,
      required: true
    },
    weight: {
      type: Number,
      required: true
    },
    calo_target: {
      type: Number,
      required: true
    },
    total_calo_burn: {
      type: Number,
      default: 0
    },
    start_date: {
      type: Date,
      required: true
    },
    end_date: {
      type: Date,
      required: true
    }
  },
  {
    timestamps: true,
    collection: 'workout_schedules'
  }
)

const WorkoutScheduleModel = mongoose.model('workout_schedules', WorkoutScheduleSchema)

export default WorkoutScheduleModel
