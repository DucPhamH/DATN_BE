import mongoose from 'mongoose'
import { Types } from 'mongoose'

export interface LikePost {
  user_id: Types.ObjectId
  post_id: Types.ObjectId
}

const LikePostSchema = new mongoose.Schema<LikePost>(
  {
    user_id: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'users',
      required: true
    },
    post_id: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'posts',
      required: true
    }
  },
  {
    timestamps: true,
    collection: 'like_posts'
  }
)

const LikePostModel = mongoose.model('like_posts', LikePostSchema)

export default LikePostModel
