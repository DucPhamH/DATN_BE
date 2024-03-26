import axios from 'axios'
import { omit } from 'lodash'
import { envConfig } from '~/constants/config'
import { TokenType } from '~/constants/enums'
import HTTP_STATUS from '~/constants/httpStatus'
import { AUTH_USER_MESSAGE } from '~/constants/messages'
import { UserLoginRequest, UserRegisterRequest } from '~/models/requests/authUser.request'
import RefreshTokenModel from '~/models/schemas/refreshToken.schema'
import UserModel from '~/models/schemas/user.schema'
import { hashPassword } from '~/utils/crypto'
import { ErrorWithStatus } from '~/utils/error'
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
  private decodeAccessToken(access_token: string) {
    return verifyToken({
      token: access_token,
      secretOrPublicKey: envConfig.JWT_SECRET_ACCESS_TOKEN
    })
  }
  async checkEmailExist(email: string) {
    const user = await UserModel.findOne({ email })
    return Boolean(user)
  }
  private async getOauthGoogleToken(code: string) {
    const body = {
      code,
      client_id: envConfig.GOOGLE_CLIENT_ID,
      client_secret: envConfig.GOOGLE_CLIENT_SECRET,
      redirect_uri: envConfig.GOOGLE_REDIRECT_URI,
      grant_type: 'authorization_code'
    }
    const { data } = await axios.post('https://oauth2.googleapis.com/token', body, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    })
    return data as {
      access_token: string
      id_token: string
    }
  }
  private async getGoogleUserInfo(access_token: string, id_token: string) {
    const { data } = await axios.get('https://www.googleapis.com/oauth2/v1/userinfo', {
      params: {
        access_token,
        alt: 'json'
      },
      headers: {
        Authorization: `Bearer ${id_token}`
      }
    })
    return data as {
      id: string
      email: string
      verified_email: boolean
      name: string
      given_name: string
      family_name: string
      picture: string
      locale: string
    }
  }
  async oauth(code: string) {
    const { id_token, access_token } = await this.getOauthGoogleToken(code)
    const userInfo = await this.getGoogleUserInfo(access_token, id_token)
    // console.log('userInfo', userInfo)
    // Kiểm tra email đã được đăng ký chưa
    if (!userInfo.verified_email) {
      throw new ErrorWithStatus({
        message: AUTH_USER_MESSAGE.GMAIL_NOT_VERIFIED,
        status: HTTP_STATUS.BAD_REQUEST
      })
    }
    const user = await UserModel.findOne({ email: userInfo.email })
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
      const { iat: refresh_token_iat, exp: refresh_token_exp } = await this.decodeRefreshToken(refresh_token)
      const { iat: access_token_iat, exp: access_token_exp } = await this.decodeAccessToken(access_token)
      await RefreshTokenModel.create({
        token: refresh_token,
        user_id: user._id,
        iat: refresh_token_iat,
        exp: refresh_token_exp
      })
      return {
        access_token: `Bearer ${access_token}`,
        refresh_token,
        access_token_iat,
        access_token_exp,
        refresh_token_iat,
        refresh_token_exp,
        user: omit(user.toObject(), ['password'])
      }
    } else {
      const password = Math.random().toString(36).slice(-8)
      const hashedPassword = await hashPassword(password)
      const newUser = await UserModel.create({
        name: userInfo.name,
        email: userInfo.email,
        user_name: userInfo.email.split('@')[0],
        avatar: userInfo.picture,
        password: hashedPassword
      })
      const [access_token, refresh_token] = await Promise.all([
        this.signAccessToken({
          user_id: newUser._id.toString(),
          role: Number(newUser.role),
          email: newUser.email,
          status: Number(newUser.status),
          user_name: newUser.user_name
        }),
        this.signRefreshToken({
          user_id: newUser._id.toString(),
          role: Number(newUser.role),
          email: newUser.email,
          status: Number(newUser.status),
          user_name: newUser.user_name
        })
      ])
      const { iat: refresh_token_iat, exp: refresh_token_exp } = await this.decodeRefreshToken(refresh_token)
      const { iat: access_token_iat, exp: access_token_exp } = await this.decodeAccessToken(access_token)
      await RefreshTokenModel.create({
        token: refresh_token,
        user_id: newUser._id,
        iat: refresh_token_iat,
        exp: refresh_token_exp
      })
      return {
        access_token: `Bearer ${access_token}`,
        refresh_token,
        access_token_iat,
        access_token_exp,
        refresh_token_iat,
        refresh_token_exp,
        user: omit(newUser.toObject(), ['password'])
      }
    }
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
      const { iat: refresh_token_iat, exp: refresh_token_exp } = await this.decodeRefreshToken(refresh_token)
      const { iat: access_token_iat, exp: access_token_exp } = await this.decodeAccessToken(access_token)
      await RefreshTokenModel.create({
        token: refresh_token,
        user_id: user._id,
        iat: refresh_token_iat,
        exp: refresh_token_exp
      })
      return {
        access_token: `Bearer ${access_token}`,
        refresh_token,
        access_token_iat,
        access_token_exp,
        refresh_token_iat,
        refresh_token_exp,
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
      access_token: `Bearer ${new_access_token}`,
      refresh_token: new_refresh_token
    }
  }
}

const authUserService = new AuthUserService()
export default authUserService
