import mongoose, { Types } from 'mongoose'

export interface RefreshTokens {
  token: string
  user_id: Types.ObjectId
}
const RefreshTokenSchema = new mongoose.Schema<RefreshTokens>(
  {
    token: { type: String, default: null },
    user_id: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'users',
      required: true
    }
  },
  {
    timestamps: true,
    collection: 'refresh_tokens'
  }
)

const RefreshTokenModel = mongoose.model('refresh_tokens', RefreshTokenSchema)

export default RefreshTokenModel
