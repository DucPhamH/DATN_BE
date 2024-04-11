import { Request, Response } from 'express'
import HTTP_STATUS from '~/constants/httpStatus'
import { USER_MESSAGE } from '~/constants/messages'
import { TokenPayload } from '~/models/requests/authUser.request'
import usersService from '~/services/userServices/user.services'
import { ErrorWithStatus } from '~/utils/error'

export const getMeController = async (req: Request, res: Response) => {
  const user = req.decoded_authorization as TokenPayload
  console.log(user)
  const me = await usersService.getMe({
    user_id: user.user_id
  })
  return res.json({
    message: USER_MESSAGE.GET_ME_SUCCESS,
    result: me
  })
}

export const getUserController = async (req: Request, res: Response) => {
  const { id } = req.params
  const user = req.decoded_authorization as TokenPayload
  const result = await usersService.getUserById({
    id: id,
    user_id: user.user_id
  })
  return res.json({
    message: USER_MESSAGE.GET_USER_SUCCESS,
    result: result
  })
}

export const followUserController = async (req: Request, res: Response) => {
  const user = req.decoded_authorization as TokenPayload
  const { follow_id } = req.body
  if (user.user_id === follow_id) {
    throw new ErrorWithStatus({
      message: USER_MESSAGE.CANNOT_FOLLOW_YOURSELF,
      status: HTTP_STATUS.BAD_REQUEST
    })
  }
  const result = await usersService.followUserService(user.user_id, follow_id)
  return res.json({
    message: USER_MESSAGE.FOLLOW_USER_SUCCESS,
    result: result
  })
}

export const unfollowUserController = async (req: Request, res: Response) => {
  const user = req.decoded_authorization as TokenPayload
  const { follow_id } = req.body
  const result = await usersService.unfollowUserService(user.user_id, follow_id)
  return res.json({
    message: USER_MESSAGE.UNFOLLOW_USER_SUCCESS,
    result: result
  })
}
