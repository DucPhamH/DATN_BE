import mongoose, { Types } from 'mongoose'

export interface BookmarkRecipe {
  user_id: Types.ObjectId
  recipe_id: Types.ObjectId
}

const BookmarkRecipeSchema = new mongoose.Schema<BookmarkRecipe>(
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
    collection: 'bookmark_recipes'
  }
)

const BookmarkRecipeModel = mongoose.model('bookmark_recipes', BookmarkRecipeSchema)

export default BookmarkRecipeModel
