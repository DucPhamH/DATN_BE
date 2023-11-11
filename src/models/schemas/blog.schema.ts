import mongoose, { Types } from 'mongoose'

export interface Blogs {
  title: string
  description: string
  userID: Types.ObjectId
}
const BlogsSchema = new mongoose.Schema<Blogs>(
  {
    title: { type: String, default: '', required: true },
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

const BlogsModel = mongoose.model('blogs', BlogsSchema)

export default BlogsModel
