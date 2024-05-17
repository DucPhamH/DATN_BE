import mongoose, { Types } from 'mongoose'
import { PostStatus, PostTypes } from '~/constants/enums'
import moment from 'moment'

export interface Post {
  content?: string
  user_id: Types.ObjectId
  type?: PostTypes
  status?: PostStatus
  is_banned?: boolean
  parent_id: Types.ObjectId | null
  // mảng object report_post: { user_id: Types.ObjectId, reason: string, created_at: Date }
  report_post?: { user_id: Types.ObjectId; reason: string; created_at: Date }[]
}

const PostSchema = new mongoose.Schema<Post>(
  {
    content: { type: String, default: '' },
    user_id: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'users',
      required: true
    },
    type: { type: Number, default: PostTypes.post },
    status: { type: Number, default: PostStatus.publish },
    is_banned: { type: Boolean, default: false },
    parent_id: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'posts',
      default: null
    },
    report_post: [
      {
        user_id: {
          type: mongoose.SchemaTypes.ObjectId,
          ref: 'users',
          default: null
        },
        reason: { type: String, default: '' },
        created_at: { type: Date, default: moment().toDate() }
      }
    ]
  },
  {
    timestamps: true,
    collection: 'posts'
  }
)

PostSchema.index({ content: 'text' }, { default_language: 'none' })

const PostModel = mongoose.model('posts', PostSchema)

export default PostModel
