import { omit } from 'lodash'
import { envConfig } from '~/constants/config'
import { TokenType } from '~/constants/enums'
import { AUTH_USER_MESSAGE } from '~/constants/messages'
import { UserLoginRequest, UserRegisterRequest } from '~/models/requests/authUser.request'
import RefreshTokenModel from '~/models/schemas/refreshToken.schema'
import UserModel from '~/models/schemas/user.schema'
import { hashPassword } from '~/utils/crypto'
import { signToken } from '~/utils/jwt'

class AuthUserService {
  private signAccessToken(user_id: string) {
    return signToken({
      payload: {
        user_id,
        token_type: TokenType.AccessToken
      },
      privateKey: envConfig.JWT_SECRET_ACCESS_TOKEN,
      options: {
        expiresIn: envConfig.ACCESS_TOKEN_EXPIRES_IN
      }
    })
  }
  private signRefreshToken(user_id: string) {
    return signToken({
      payload: {
        user_id,
        token_type: TokenType.RefreshToken
      },
      privateKey: envConfig.JWT_SECRET_REFRESH_TOKEN,
      options: {
        expiresIn: envConfig.REFRESH_TOKEN_EXPIRES_IN
      }
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
    if (user) {
      const [access_token, refresh_token] = await Promise.all([
        this.signAccessToken(user._id.toString()),
        this.signRefreshToken(user._id.toString())
      ])
      await RefreshTokenModel.create({ token: refresh_token, user_id: user._id })
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
}

const authUserService = new AuthUserService()
export default authUserService
