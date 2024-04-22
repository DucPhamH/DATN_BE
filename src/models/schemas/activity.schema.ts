import mongoose, { Types } from 'mongoose'

export interface Activity {
  code: string
  met: string
  activity: string
  activity_category_id: Types.ObjectId
}

const ActivitySchema = new mongoose.Schema<Activity>(
  {
    code: { type: String, default: '' },
    met: { type: String, default: '' },
    activity: { type: String, default: '' },
    activity_category_id: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'activity_categories',
      required: true
    }
  },
  {
    collection: 'activities'
  }
)

const ActivityModel = mongoose.model('activities', ActivitySchema)

export default ActivityModel
