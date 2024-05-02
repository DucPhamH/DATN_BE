import mongoose, { Types } from 'mongoose'

export interface ActivityCategory {
  name: string
}

const ActivityCategorySchema = new mongoose.Schema<ActivityCategory>(
  {
    name: { type: String, default: '' }
  },
  {
    collection: 'activity_categories'
  }
)

const ActivityCategoryModel = mongoose.model('activity_categories', ActivityCategorySchema)

export default ActivityCategoryModel
