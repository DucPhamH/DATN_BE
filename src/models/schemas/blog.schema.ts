import mongoose, { Types } from 'mongoose'

export interface Blogs {
  title: string
  description: string
  userID: Types.ObjectId
}
const BlogSchema = new mongoose.Schema<Blogs>(
  {
    title: { type: String, default: '', required: true, index: true },
    description: { type: String, maxlength: 1000, default: '' },
    userID: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'users',
      required: true
    }
  },
  {
    timestamps: true,
    collection: 'blogs'
  }
)

const BlogModel = mongoose.model('blogs', BlogSchema)

export default BlogModel
