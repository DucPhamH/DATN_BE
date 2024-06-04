import mongoose, { Types } from 'mongoose'
import { AlbumStatus } from '~/constants/enums'

export interface Album {
  title: string
  description: string
  image: string
  user_id: Types.ObjectId
  search_fields?: string
  status?: AlbumStatus
  category_album: string
}

const AlbumSchema = new mongoose.Schema<Album>(
  {
    title: { type: String, default: '' },
    description: { type: String, default: '' },
    image: { type: String, default: '' },
    user_id: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'users',
      required: true
    },
    search_fields: { type: String, default: '' },
    status: { type: Number, default: AlbumStatus.pending },
    category_album: { type: String, default: '' }
  },
  {
    timestamps: true,
    collection: 'albums'
  }
)

AlbumSchema.pre('save', async function (next) {
  try {
    this.search_fields = `${this.title} ${this.description}`.toLowerCase()
    next()
  } catch (error: any) {
    next(error)
  }
})

AlbumSchema.index({ search_fields: 'text' }, { default_language: 'none' })

const AlbumModel = mongoose.model('albums', AlbumSchema)

export default AlbumModel
