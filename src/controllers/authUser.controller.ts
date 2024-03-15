import { Request, Response } from 'express'
import { AUTH_USER_MESSAGE } from '~/constants/messages'
import { TokenPayload } from '~/models/requests/authUser.request'

import authUserService from '~/services/authUser.services'

export const registerController = async (req: Request, res: Response) => {
  const { name, email, password } = req.body
  const result = await authUserService.register({ name, email, password })
  return res.json({
    message: AUTH_USER_MESSAGE.REGISTER_SUCCESS,
    result
  })
}

export const loginController = async (req: Request, res: Response) => {
  const { email, password } = req.body
  const result = await authUserService.login({ email, password })
  return res.json({
    message: AUTH_USER_MESSAGE.LOGIN_SUCCESS,
    result
  })
}

export const logoutController = async (req: Request, res: Response) => {
  const { refresh_token } = req.body
  const { decoded_authorization } = req
  console.log('decoded_authorization', decoded_authorization)
  const result = await authUserService.logout(refresh_token)
  return res.json(result)
}

export const refreshTokenController = async (req: Request, res: Response) => {
  const { refresh_token } = req.body
  const user = req.decoded_refresh_token as TokenPayload
  const result = await authUserService.refreshToken({
    user_id: user.user_id,
    role: user.role,
    email: user.email,
    status: user.status,
    user_name: user.user_name,
    refresh_token: refresh_token,
    exp: user.exp
  })
  return res.json({
    message: AUTH_USER_MESSAGE.REFRESH_TOKEN_SUCCESS,
    result
  })
}
