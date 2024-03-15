import { Request, Response } from 'express'

import authUserService from '~/services/authUser.services'

export const registerController = async (req: Request, res: Response) => {
  const { name, email, password } = req.body
  const result = await authUserService.register({ name, email, password })
  return res.json({
    message: 'Register success',
    result
  })
}

export const loginController = async (req: Request, res: Response) => {
  const { email, password } = req.body
  const result = await authUserService.login({ email, password })
  return res.json({
    message: 'Login success',
    result
  })
}
