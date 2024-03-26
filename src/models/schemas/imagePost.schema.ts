import mongoose from 'mongoose'
import { Types } from 'mongoose'

export interface ImagePost {
  url: string
  post_id: Types.ObjectId
}

const ImagePostSchema = new mongoose.Schema<ImagePost>(
  {
    url: { type: String, default: '' },
    post_id: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'posts',
      required: true
    }
  },
  {
    timestamps: true,
    collection: 'image_posts'
  }
)

const ImagePostModel = mongoose.model('image_posts', ImagePostSchema)

export default ImagePostModel
