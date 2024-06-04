import ActivityModel from '~/models/schemas/activity.schema'

class ActivityService {
  async getListActivityService({
    page,
    limit,
    search,
    activity_category
  }: {
    page: number
    limit: number
    search: string
    activity_category: string
  }) {
    const condition: any = {}

    if (search !== undefined) {
      // condition.activity = { $regex: search, $options: 'i' }
      condition.$text = { $search: search }
    }

    console.log(condition)

    if (activity_category !== undefined) {
      condition.activity_category = activity_category
    }

    if (!page) {
      page = 1
    }

    if (!limit) {
      limit = 10
    }

    const activities = await ActivityModel.find(condition)
      .skip((page - 1) * limit)
      .limit(limit)

    const totalPage = Math.ceil((await ActivityModel.find(condition)).length / limit)

    return { activities, totalPage, page, limit }
  }
}

const activityService = new ActivityService()
export default activityService
