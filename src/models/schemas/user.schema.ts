import mongoose from 'mongoose'

export interface User {
  name: string
  image?: string
}

const UserSchema = new mongoose.Schema<User>(
  {
    name: { type: String, maxlength: 160, required: true },
    image: {
      type: String,
      maxlength: 1000,
      default: ''
    }
  },
  {
    timestamps: true,
    collection: 'users'
  }
)

const UserModel = mongoose.model('users', UserSchema)

export default UserModel
