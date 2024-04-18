import { Request, Response } from 'express'
import { AUTH_USER_MESSAGE } from '~/constants/messages'
import authAdminService from '~/services/adminServices/authAdmin.services'

export const loginAdminController = async (req: Request, res: Response) => {
  const { user_name, password } = req.body
  const result = await authAdminService.loginAdmin({ user_name, password })
  return res.json({
    message: AUTH_USER_MESSAGE.LOGIN_SUCCESS,
    result
  })
}

export const logoutAdminController = async (req: Request, res: Response) => {
  const { decoded_authorization } = req
  console.log('decoded_authorization', decoded_authorization)
  const result = await authAdminService.logoutAdmin()
  return res.json(result)
}
