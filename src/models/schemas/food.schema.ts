import mongoose, { Types } from 'mongoose'
import { BlogStatus, DifficultLevel, FoodType, RegionFood } from '~/constants/enums'

export interface Food {
  title: string
  content: string
  description: string
  image: string
  video?: string
  time: number
  region: RegionFood
  difficult_level: DifficultLevel
  user_id?: Types.ObjectId
  processing_food?: string
  is_banned?: boolean
  status?: BlogStatus
  type?: FoodType
  user_view?: number
  search_fields?: string
}

const FoodSchema = new mongoose.Schema<Food>(
  {
    title: { type: String, default: '' },
    content: { type: String, default: '' },
    description: { type: String, default: '' },
    image: { type: String, default: '' },
    video: { type: String, default: '' },
    time: { type: Number, default: 0 },
    region: { type: Number, default: RegionFood.north },
    difficult_level: { type: Number, default: DifficultLevel.easy },
    user_id: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'users',
      required: true
    },
    processing_food: { type: String, default: '' },
    search_fields: { type: String, default: '' },
    is_banned: { type: Boolean, default: false },
    status: { type: Number, default: BlogStatus.pending },
    user_view: { type: Number, default: 0 }
  },
  {
    timestamps: true,
    collection: 'foods'
  }
)

FoodSchema.pre('save', async function (next) {
  try {
    this.search_fields = `${this.title} ${this.description}`.toLowerCase()
    next()
  } catch (error: any) {
    next(error)
  }
})

const FoodModel = mongoose.model('foods', FoodSchema)

export default FoodModel
