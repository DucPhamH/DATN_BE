import axios from 'axios'
import { omit } from 'lodash'
import { envConfig } from '~/constants/config'
import { TokenType, UserStatus } from '~/constants/enums'
import HTTP_STATUS from '~/constants/httpStatus'
import { AUTH_USER_MESSAGE } from '~/constants/messages'
import { UserLoginRequest, UserRegisterRequest } from '~/models/requests/authUser.request'
import RefreshTokenModel from '~/models/schemas/refreshToken.schema'
import UserModel from '~/models/schemas/user.schema'
import { hashPassword } from '~/utils/crypto'
import { ErrorWithStatus } from '~/utils/error'
import { signToken, verifyToken } from '~/utils/jwt'

class AuthAdminService {
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
  private decodeAccessToken(access_token: string) {
    return verifyToken({
      token: access_token,
      secretOrPublicKey: envConfig.JWT_SECRET_ACCESS_TOKEN
    })
  }

  async loginAdmin({ user_name, password }: { user_name: string; password: string }) {
    const user = await UserModel.findOne({ user_name })
    if (user) {
      const access_token = await this.signAccessToken({
        user_id: user._id.toString(),
        role: Number(user.role),
        email: user.email,
        status: Number(user.status),
        user_name: user.user_name
      })

      const { iat: access_token_iat, exp: access_token_exp } = await this.decodeAccessToken(access_token)
      return {
        access_token: `Bearer ${access_token}`,
        access_token_iat,
        access_token_exp,
        user: omit(user.toObject(), ['password'])
      }
    }
  }
  async logout() {
    return {
      message: AUTH_USER_MESSAGE.LOGOUT_SUCCESS
    }
  }
}

const authAdminService = new AuthAdminService()
export default authAdminService
