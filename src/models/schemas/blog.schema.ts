import mongoose, { Types } from 'mongoose'
import { BlogStatus } from '~/constants/enums'

export interface Blog {
  title: string
  content: string
  description: string
  image: string
  user_id?: Types.ObjectId
  writer_id?: Types.ObjectId
  category_blog_id?: Types.ObjectId
  is_banned?: boolean
  status?: number
  user_view?: number
}
const BlogSchema = new mongoose.Schema<Blog>(
  {
    title: { type: String, default: '' },
    content: { type: String, default: '' },
    description: { type: String, default: '' },
    image: { type: String, default: '' },
    user_id: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'users',
      required: true
    },
    writer_id: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'users',
      default: null
    },
    category_blog_id: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'category_blogs',
      required: true
    },
    is_banned: { type: Boolean, default: false },
    status: { type: Number, default: BlogStatus.pending },
    user_view: { type: Number, default: 0 }
  },
  {
    timestamps: true,
    collection: 'blogs'
  }
)

const BlogModel = mongoose.model('blogs', BlogSchema)

export default BlogModel
