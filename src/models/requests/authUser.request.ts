import { JwtPayload } from 'jsonwebtoken'
import { TokenType } from '~/constants/enums'

export interface UserRegisterRequest {
  name: string
  email: string
  password: string
}

export interface UserLoginRequest {
  email: string
  password: string
}

export interface LogoutReqBody {
  refresh_token: string
}

export interface TokenPayload extends JwtPayload {
  user_id: string
  role: number
  email: string
  status: number
  user_name: string
  token_type: TokenType
  exp: number
  iat: number
}
