import mongoose from 'mongoose'
import { Types } from 'mongoose'

export interface LikeRecipe {
  user_id: Types.ObjectId
  recipe_id: Types.ObjectId
}

const LikeRecipeSchema = new mongoose.Schema<LikeRecipe>(
  {
    user_id: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'users',
      required: true
    },
    recipe_id: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'recipes',
      required: true
    }
  },
  {
    timestamps: true,
    collection: 'like_recipes'
  }
)

const LikeRecipeModel = mongoose.model('like_recipes', LikeRecipeSchema)

export default LikeRecipeModel
