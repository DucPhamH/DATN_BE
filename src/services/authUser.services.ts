import { omit } from 'lodash'
import { envConfig } from '~/constants/config'
import { TokenType } from '~/constants/enums'
import { UserLoginRequest, UserRegisterRequest } from '~/models/requests/authUser.request'
import UserModel from '~/models/schemas/user.schema'
import { comparePassword, hashPassword } from '~/utils/crypto'
import { ErrorWithStatus } from '~/utils/error'
import { signToken } from '~/utils/jwt'

class AuthUserService {
  private signAccessToken(user_id: string) {
    return signToken({
      payload: {
        user_id,
        token_type: TokenType.AccessToken
      },
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
    const { email, password } = payload
    const user = await UserModel.findOne({ email })
    console.log('user', user)
    if (!user) {
      throw new ErrorWithStatus({ message: 'User not found', status: 404 })
    }
    if (user) {
      const compare = await comparePassword(password, user.password)
      console.log('compare', compare)
      if (!compare) {
        throw new Error('Password not match')
      }
      const [accessToken, refreshToken] = await Promise.all([
        this.signAccessToken(user._id.toString()),
        this.signRefreshToken(user._id.toString())
      ])
      const newUser = omit(user.toObject(), ['password'])
      return {
        newUser,
        accessToken,
        refreshToken
      }
    }
  }
}

const authUserService = new AuthUserService()
export default authUserService
