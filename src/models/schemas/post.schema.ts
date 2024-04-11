import mongoose, { Types } from 'mongoose'
import { PostStatus, PostTypes } from '~/constants/enums'
import moment from 'moment-timezone'

export interface Post {
  content?: string
  user_id: Types.ObjectId
  type?: PostTypes
  status?: PostStatus
  is_banned?: boolean
  parent_id: Types.ObjectId | null
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
    }
  },
  {
    timestamps: true,
    collection: 'posts'
  }
)

const PostModel = mongoose.model('posts', PostSchema)

export default PostModel
