import { Request, Response } from 'express'
import usersService from '~/services/user.services'

export const createUserController = async (req: Request, res: Response) => {
  try {
    const result = await usersService.createUser(req.body)
    return res.json({
      message: 'User created successfully',
      result: result
    })
  } catch (error) {
    return res.status(400).json({
      message: 'Error creating user',
      error
    })
  }
}

export const getUsersController = async (req: Request, res: Response) => {
  try {
    const result = await usersService.getUsers()
    return res.json({
      message: 'Users fetched successfully',
      result: result
    })
  } catch (error) {
    return res.status(400).json({
      message: 'Error fetching users',
      error
    })
  }
}

export const getMeController = async (req: Request, res: Response) => {
  const { decoded_authorization } = req
  const result = await usersService.getMe(decoded_authorization?.user_id as string)
  return res.json({
    message: 'User fetched successfully',
    result: result
  })
}
