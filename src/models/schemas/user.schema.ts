import mongoose from 'mongoose'
import { UserGender, UserRoles, UserStatus } from '~/constants/enums'

export interface User {
  name: string
  user_name: string
  email: string
  password: string
  avatar?: string
  cover_avatar?: string
  birthday?: Date
  address?: string
  gender?: string
  weight?: number
  height?: number
  age?: number
  hip?: number
  neck?: number
  waist?: number
  role?: UserRoles
  banned_count?: number
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
    birthday: {
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
    weight: {
      type: Number,
      default: 0
    },
    height: {
      type: Number,
      default: 0
    },
    age: {
      type: Number,
      default: 0
    },
    hip: {
      type: Number,
      default: 0
    },
    neck: {
      type: Number,
      default: 0
    },
    waist: {
      type: Number,
      default: 0
    },
    role: {
      type: Number,
      default: UserRoles.user
    },
    banned_count: {
      type: Number,
      default: 0
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
