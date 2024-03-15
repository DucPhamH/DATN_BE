import { omit } from 'lodash'
import { envConfig } from '~/constants/config'
import { TokenType } from '~/constants/enums'
import { AUTH_USER_MESSAGE } from '~/constants/messages'
import { UserLoginRequest, UserRegisterRequest } from '~/models/requests/authUser.request'
import RefreshTokenModel from '~/models/schemas/refreshToken.schema'
import UserModel from '~/models/schemas/user.schema'
import { hashPassword } from '~/utils/crypto'
import { signToken, verifyToken } from '~/utils/jwt'

class AuthUserService {
  private signAccessToken(payload: {
    user_id: string
    role: number
    email: string
    status: number
    user_name: string
  }) {
    return signToken({
      payload: {
        user_id: payload.user_id,
        role: payload.role,
        email: payload.email,
        status: payload.status,
        user_name: payload.user_name,
        token_type: TokenType.AccessToken
      },
      privateKey: envConfig.JWT_SECRET_ACCESS_TOKEN,
      options: {
        expiresIn: envConfig.ACCESS_TOKEN_EXPIRES_IN
      }
    })
  }
  private signRefreshToken(payload: {
    user_id: string
    role: number
    email: string
    status: number
    user_name: string
    exp?: number
  }) {
    if (payload.exp) {
      return signToken({
        payload: {
          user_id: payload.user_id,
          role: payload.role,
          email: payload.email,
          status: payload.status,
          user_name: payload.user_name,
          token_type: TokenType.RefreshToken,
          exp: payload.exp
        },
        privateKey: envConfig.JWT_SECRET_REFRESH_TOKEN
      })
    }
    return signToken({
      payload: {
        user_id: payload.user_id,
        role: payload.role,
        email: payload.email,
        status: payload.status,
        user_name: payload.user_name,
        token_type: TokenType.RefreshToken
      },
      privateKey: envConfig.JWT_SECRET_REFRESH_TOKEN,
      options: {
        expiresIn: envConfig.REFRESH_TOKEN_EXPIRES_IN
      }
    })
  }
  private decodeRefreshToken(refresh_token: string) {
    return verifyToken({
      token: refresh_token,
      secretOrPublicKey: envConfig.JWT_SECRET_REFRESH_TOKEN
    })
  }
  async checkEmailExist(email: string) {
    const user = await UserModel.findOne({ email })
    return Boolean(user)
  }
  async register(payload: UserRegisterRequest) {
    const { name, email, password } = payload
    const user_name = email.split('@')[0]
    const hashedPassword = await hashPassword(password)
    const user = await UserModel.create({ name, email, user_name, password: hashedPassword })
    const newUser = omit(user.toObject(), ['password'])
    return newUser
  }
  async login(payload: UserLoginRequest) {
    const { email } = payload
    const user = await UserModel.findOne({ email })
    console.log('user', user)
    if (user) {
      const [access_token, refresh_token] = await Promise.all([
        this.signAccessToken({
          user_id: user._id.toString(),
          role: Number(user.role),
          email: user.email,
          status: Number(user.status),
          user_name: user.user_name
        }),
        this.signRefreshToken({
          user_id: user._id.toString(),
          role: Number(user.role),
          email: user.email,
          status: Number(user.status),
          user_name: user.user_name
        })
      ])
      const { iat, exp } = await this.decodeRefreshToken(refresh_token)
      await RefreshTokenModel.create({ token: refresh_token, user_id: user._id, iat, exp })
      return {
        access_token,
        refresh_token,
        user: omit(user.toObject(), ['password'])
      }
    }
  }
  async logout(refresh_token: string) {
    const result = await RefreshTokenModel.deleteOne({ token: refresh_token })
    return {
      message: AUTH_USER_MESSAGE.LOGOUT_SUCCESS
    }
  }
  async refreshToken(user: {
    user_id: string
    role: number
    email: string
    status: number
    user_name: string
    refresh_token: string
    exp: number
  }) {
    const [new_access_token, new_refresh_token] = await Promise.all([
      this.signAccessToken({
        user_id: user.user_id.toString(),
        role: Number(user.role),
        email: user.email,
        status: Number(user.status),
        user_name: user.user_name
      }),
      this.signRefreshToken({
        user_id: user.user_id.toString(),
        role: Number(user.role),
        email: user.email,
        status: Number(user.status),
        user_name: user.user_name,
        exp: user.exp
      })
    ])
    console.log('user', user)
    await RefreshTokenModel.deleteOne({ token: user.refresh_token })
    const { iat, exp } = await this.decodeRefreshToken(new_refresh_token)
    await RefreshTokenModel.create({ token: new_refresh_token, user_id: user.user_id, iat, exp })
    return {
      access_token: new_access_token,
      refresh_token: new_refresh_token
    }
  }
}

const authUserService = new AuthUserService()
export default authUserService
