import mongoose, { Types } from 'mongoose'
import { DifficultLevel, RecipeStatus, RecipeType, RegionRecipe } from '~/constants/enums'

export interface Recipe {
  title: string
  content: string
  description: string
  image: string
  image_name?: string
  video?: string
  time: number
  region: RegionRecipe
  difficult_level: DifficultLevel
  energy?: number
  protein?: number
  fat?: number
  carbohydrate?: number
  unit?: string
  quantity?: number
  ingredients?: {
    name: string
    energy: number
    protein: number
    fat: number
    carbohydrate: number
  }[]
  user_id: Types.ObjectId
  processing_food?: string
  status?: RecipeStatus
  type?: RecipeType
  album_id?: Types.ObjectId
  user_view?: number
  category_recipe_id?: Types.ObjectId
  search_fields?: string
}

const RecipeSchema = new mongoose.Schema<Recipe>(
  {
    title: { type: String, default: '' },
    content: { type: String, default: '' },
    description: { type: String, default: '' },
    image: { type: String, default: '' },
    image_name: { type: String, default: '' },
    video: { type: String, default: '' },
    time: { type: Number, default: 0 },
    region: { type: Number, default: RegionRecipe.north },
    difficult_level: { type: Number, default: DifficultLevel.easy },
    energy: { type: Number, default: 0 },
    protein: { type: Number, default: 0 },
    fat: { type: Number, default: 0 },
    carbohydrate: { type: Number, default: 0 },
    unit: { type: String, default: '' },
    quantity: { type: Number, default: 0 },
    ingredients: [
      {
        name: { type: String, default: '' },
        energy: { type: Number, default: 0 },
        protein: { type: Number, default: 0 },
        fat: { type: Number, default: 0 },
        carbohydrate: { type: Number, default: 0 }
      }
    ],
    user_id: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'users',
      required: true
    },
    album_id: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'albums',
      default: null
    },
    category_recipe_id: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'recipe_categories',
      required: true
    },
    processing_food: { type: String, default: '' },
    search_fields: { type: String, default: '' },
    status: { type: Number, default: RecipeStatus.pending },
    user_view: { type: Number, default: 0 },
    type: { type: Number, default: RecipeType.chef }
  },
  {
    timestamps: true,
    collection: 'recipes'
  }
)

RecipeSchema.pre('save', async function (next) {
  try {
    this.search_fields = `${this.title} ${this.description}`.toLowerCase()
    next()
  } catch (error: any) {
    next(error)
  }
})

RecipeSchema.index({ search_fields: 'text' }, { default_language: 'none' })

const RecipeModel = mongoose.model('recipes', RecipeSchema)

export default RecipeModel
