import { ObjectId } from 'mongodb'
import ActivityModel from '~/models/schemas/activity.schema'
import ActivityCategoryModel from '~/models/schemas/activityCategory.schema'

class ActivityService {
  async getListActivityCategoryService() {
    const categories = await ActivityCategoryModel.find()
    return categories
  }
  async getListActivityService({
    page,
    limit,
    search,
    activity_category_id
  }: {
    page: number
    limit: number
    search: string
    activity_category_id: string
  }) {
    const condition: any = {}

    if (search !== undefined) {
      condition.activity = { $regex: search, $options: 'i' }
    }

    if (activity_category_id !== undefined) {
      condition.activity_category_id = new ObjectId(activity_category_id)
    }

    if (!page) {
      page = 1
    }

    if (!limit) {
      limit = 10
    }

    const activities = await ActivityModel.find(condition)
      .populate('activity_category_id')
      .skip((page - 1) * limit)
      .limit(limit)

    const totalPage = Math.ceil((await ActivityModel.find(condition)).length / limit)

    return { activities, totalPage, page, limit }
  }
}

const activityService = new ActivityService()
export default activityService
