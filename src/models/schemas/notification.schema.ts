import mongoose, { Types } from 'mongoose'
import { NotificationTypes } from '~/constants/enums'

export interface Notification {
  _id: Types.ObjectId
  sender_id?: Types.ObjectId
  receiver_id: Types.ObjectId
  content: string
  name_notification?: string
  link_id?: string
  is_read: boolean
  type: NotificationTypes
}

const NotificationSchema = new mongoose.Schema<Notification>(
  {
    sender_id: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'users',
      default: null
    },
    receiver_id: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'users',
      required: true
    },
    content: { type: String, required: true },
    name_notification: { type: String, default: '' },
    link_id: { type: String, default: '' },
    is_read: { type: Boolean, default: false },
    type: { type: Number, required: true }
  },
  {
    timestamps: true,
    collection: 'notifications'
  }
)

const NotificationModel = mongoose.model('notifications', NotificationSchema)

export default NotificationModel
