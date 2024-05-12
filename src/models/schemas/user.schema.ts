import moment from 'moment'
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
  pre_weight?: {
    weight: number
    date: Date
  }[]
  height?: number
  age?: number
  hip?: number
  neck?: number
  waist?: number
  activity_level?: number
  BMI?: number
  BMR?: number
  TDEE?: number
  body_fat?: number
  IBW?: number
  LBM?: number
  role?: UserRoles
  banned_count?: number
  status?: UserStatus
  otp_code?: string
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
      default: null
    },
    pre_weight: [
      {
        weight: { type: Number, default: null },
        date: { type: Date, default: moment().toDate() }
      }
    ],
    height: {
      type: Number,
      default: null
    },
    age: {
      type: Number,
      default: null
    },
    hip: {
      type: Number,
      default: null
    },
    neck: {
      type: Number,
      default: null
    },
    waist: {
      type: Number,
      default: null
    },
    activity_level: {
      type: Number,
      default: null
    },
    BMI: {
      type: Number,
      default: null
    },
    BMR: {
      type: Number,
      default: null
    },
    TDEE: {
      type: Number,
      default: null
    },
    body_fat: {
      type: Number,
      default: null
    },
    IBW: {
      type: Number,
      default: null
    },
    LBM: {
      type: Number,
      default: null
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
    },
    otp_code: {
      type: String,
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
