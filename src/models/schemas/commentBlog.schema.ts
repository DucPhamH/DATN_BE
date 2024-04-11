import mongoose, { Types } from 'mongoose'

export interface CommentBlog {
  content: string
  user_id: Types.ObjectId
  blog_id: Types.ObjectId
  is_banned?: boolean
}

const CommentBlogSchema = new mongoose.Schema<CommentBlog>(
  {
    content: { type: String, default: '' },
    user_id: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'users',
      required: true
    },
    blog_id: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'blogs',
      required: true
    },
    is_banned: { type: Boolean, default: false }
  },
  {
    timestamps: true,
    collection: 'comment_blogs'
  }
)

const CommentBlogModel = mongoose.model('comment_blogs', CommentBlogSchema)

export default CommentBlogModel
