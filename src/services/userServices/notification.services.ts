import { ObjectId } from 'mongodb'
import NotificationModel from '~/models/schemas/notification.schema'

class NotificationService {
  async getListNotificationService({ user_id, page, limit }: { user_id: string; page: number; limit: number }) {
    if (!page) {
      page = 1
    }

    if (!limit) {
      limit = 6
    }

    const notifications = await NotificationModel.aggregate([
      {
        $match: {
          receiver_id: new ObjectId(user_id)
        }
      },
      // nối với bảng users để lấy thông tin của người gửi thông báo
      {
        $lookup: {
          from: 'users',
          localField: 'sender_id',
          foreignField: '_id',
          as: 'sender'
        }
      },
      // lấy cả những sender_id === null
      {
        $unwind: {
          path: '$sender',
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $sort: {
          createdAt: -1
        }
      },
      {
        $skip: (page - 1) * limit
      },
      {
        $limit: limit
      }
    ])

    const totalPage = Math.ceil((await NotificationModel.find({ receiver_id: user_id })).length / limit)

    return { notifications, totalPage, page, limit }
  }
  async readNotificationService({ user_id, notification_id }: { user_id: string; notification_id: string }) {
    await NotificationModel.updateOne(
      { _id: new ObjectId(notification_id), receiver_id: new ObjectId(user_id) },
      { is_read: true }
    )
    return true
  }
  async deleteNotificationService({ user_id, notification_id }: { user_id: string; notification_id: string }) {
    await NotificationModel.deleteOne({ _id: new ObjectId(notification_id), receiver_id: new ObjectId(user_id) })
    return true
  }
  async checkReadNotificationService({ user_id }: { user_id: string }) {
    // đếm số thông báo chưa đọc của user nếu > 0 thì trả về true còn không thì trả về false

    const count = await NotificationModel.countDocuments({ receiver_id: new ObjectId(user_id), is_read: false })
    return count > 0
  }
}

const notificationService = new NotificationService()
export default notificationService
