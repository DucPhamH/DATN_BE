import mongoose, { Types } from 'mongoose'

export interface RefreshTokens {
  token: string
  user_id: Types.ObjectId
  iat: Date
  exp: Date
}
const RefreshTokenSchema = new mongoose.Schema<RefreshTokens>(
  {
    token: { type: String, default: null, indexed: true },
    user_id: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'users',
      required: true
    },
    iat: { type: Date, default: null },
    exp: { type: Date, default: null }
  },
  {
    timestamps: true,
    collection: 'refresh_tokens'
  }
)
RefreshTokenSchema.index({ exp: 1 }, { expireAfterSeconds: 0 })
const RefreshTokenModel = mongoose.model('refresh_tokens', RefreshTokenSchema)

export default RefreshTokenModel
