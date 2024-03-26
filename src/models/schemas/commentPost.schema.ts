import mongoose, { Types } from 'mongoose'

export interface CommentPost {
  content: string
  user_id: Types.ObjectId
  post_id: Types.ObjectId
  parent_comment_id?: Types.ObjectId | null
}

const CommentPostSchema = new mongoose.Schema<CommentPost>(
  {
    content: { type: String, default: '' },
    user_id: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'users',
      required: true
    },
    post_id: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'posts',
      required: true
    },
    parent_comment_id: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'comment_posts',
      default: null
    }
  },
  {
    timestamps: true,
    collection: 'comment_posts'
  }
)

const CommentPostModel = mongoose.model('comment_posts', CommentPostSchema)

export default CommentPostModel
