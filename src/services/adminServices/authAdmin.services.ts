import { omit } from 'lodash'
import { ObjectId } from 'mongodb'
import { envConfig } from '~/constants/config'
import { TokenType, UserStatus } from '~/constants/enums'
import { AUTH_USER_MESSAGE } from '~/constants/messages'
import UserModel from '~/models/schemas/user.schema'
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
        expiresIn: envConfig.ACCESS_TOKEN_ADMIN_EXPIRES_IN
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
        user: omit(user.toObject(), ['password', 'upgrade_request'])
      }
    }
  }
  async logoutAdmin() {
    return {
      message: AUTH_USER_MESSAGE.LOGOUT_SUCCESS
    }
  }
  async getMe({ user_id }: { user_id: string }) {
    const me = await UserModel.aggregate([
      { $match: { _id: new ObjectId(user_id), status: UserStatus.active } },
      // bỏ password
      {
        $project: {
          password: 0
        }
      }
    ])
    return me
  }
}

const authAdminService = new AuthAdminService()
export default authAdminService
