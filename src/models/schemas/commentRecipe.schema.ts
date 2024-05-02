import mongoose, { Types } from 'mongoose'

export interface CommentRecipe {
  content: string
  user_id: Types.ObjectId
  recipe_id: Types.ObjectId
  is_banned?: boolean
}

const CommentRecipeSchema = new mongoose.Schema<CommentRecipe>(
  {
    content: { type: String, default: '' },
    user_id: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'users',
      required: true
    },
    recipe_id: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'recipes',
      required: true
    },
    is_banned: { type: Boolean, default: false }
  },
  {
    timestamps: true,
    collection: 'comment_recipes'
  }
)

const CommentRecipeModel = mongoose.model('comment_recipes', CommentRecipeSchema)

export default CommentRecipeModel
