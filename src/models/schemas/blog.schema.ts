import mongoose, { Types } from 'mongoose'
import { BlogStatus } from '~/constants/enums'

export interface Blog {
  title: string
  content: string
  description: string
  image: string
  user_id?: Types.ObjectId
  category_blog_id?: Types.ObjectId
  is_banned?: boolean
  status?: number
  user_view?: number
  search_fields?: string
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
    category_blog_id: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'category_blogs',
      required: true
    },
    search_fields: { type: String, default: '' },
    is_banned: { type: Boolean, default: false },
    status: { type: Number, default: BlogStatus.pending },
    user_view: { type: Number, default: 0 }
  },
  {
    timestamps: true,
    collection: 'blogs'
  }
)

BlogSchema.pre('save', async function (next) {
  try {
    this.search_fields = `${this.title} ${this.description}`.toLowerCase()
    next()
  } catch (error: any) {
    next(error)
  }
})

const BlogModel = mongoose.model('blogs', BlogSchema)

export default BlogModel
