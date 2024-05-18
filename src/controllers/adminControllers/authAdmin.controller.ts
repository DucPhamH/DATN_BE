import { Request, Response } from 'express'
import { AUTH_ADMIN_MESSAGE, AUTH_USER_MESSAGE } from '~/constants/messages'
import { TokenPayload } from '~/models/requests/authUser.request'
import authAdminService from '~/services/adminServices/authAdmin.services'

export const loginAdminController = async (req: Request, res: Response) => {
  const { user_name, password } = req.body
  const result = await authAdminService.loginAdmin({ user_name, password })
  return res.json({
    message: AUTH_ADMIN_MESSAGE.LOGIN_SUCCESS,
    result
  })
}

export const logoutAdminController = async (req: Request, res: Response) => {
  const { decoded_authorization } = req
  console.log('decoded_authorization', decoded_authorization)
  const result = await authAdminService.logoutAdmin()
  return res.json({
    message: AUTH_USER_MESSAGE.LOGOUT_SUCCESS,
    result
  })
}

export const getMeAdminController = async (req: Request, res: Response) => {
  const user = req.decoded_authorization as TokenPayload
  const result = await authAdminService.getMe({ user_id: user.user_id })
  return res.json({
    result
  })
}
