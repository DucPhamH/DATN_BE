import mongoose, { Types } from 'mongoose'

export interface Follow {
  user_id: Types.ObjectId
  follow_id: Types.ObjectId
}

const FollowSchema = new mongoose.Schema<Follow>(
  {
    user_id: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'users',
      required: true
    },
    follow_id: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'users',
      required: true
    }
  },
  {
    timestamps: true,
    collection: 'follows'
  }
)

const FollowModel = mongoose.model('follows', FollowSchema)

export default FollowModel
