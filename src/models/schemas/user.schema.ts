import mongoose from 'mongoose'
import { UserGender, UserRoles, UserStatus } from '~/constants/enums'

export interface User {
  name: string
  user_name: string
  email: string
  password: string
  avatar?: string
  cover_avatar?: string
  birth_day?: Date
  address?: string
  gender?: string
  role?: UserRoles
  status?: UserStatus
}

const UserSchema = new mongoose.Schema<User>(
  {
    name: { type: String, maxlength: 160, required: true },
    user_name: { type: String, maxlength: 160, required: true },
    email: { type: String, maxlength: 160, required: true },
    password: { type: String, maxlength: 160, required: true },
    cover_avatar: {
      type: String,
      default: ''
    },
    avatar: {
      type: String,
      default: ''
    },
    birth_day: {
      type: Date,
      default: null
    },
    address: {
      type: String,
      default: ''
    },
    gender: {
      type: String,
      default: UserGender.other
    },
    role: {
      type: Number,
      default: UserRoles.user
    },
    status: {
      type: Number,
      default: UserStatus.active
    }
  },
  {
    timestamps: true,
    collection: 'users'
  }
)

const UserModel = mongoose.model('users', UserSchema)

export default UserModel
