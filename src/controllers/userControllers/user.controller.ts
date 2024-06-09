import { Request, Response } from 'express'
import HTTP_STATUS from '~/constants/httpStatus'
import { USER_MESSAGE } from '~/constants/messages'
import { TokenPayload } from '~/models/requests/authUser.request'
import usersService from '~/services/userServices/user.services'
import { ErrorWithStatus } from '~/utils/error'

export const getMeController = async (req: Request, res: Response) => {
  const user = req.decoded_authorization as TokenPayload
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
  const result = await usersService.followUserService({
    user_id: user.user_id,
    follow_id: follow_id
  })
  return res.json({
    message: USER_MESSAGE.FOLLOW_USER_SUCCESS,
    result: result
  })
}

export const unfollowUserController = async (req: Request, res: Response) => {
  const user = req.decoded_authorization as TokenPayload
  const { follow_id } = req.body
  const result = await usersService.unfollowUserService({
    user_id: user.user_id,
    follow_id: follow_id
  })
  return res.json({
    message: USER_MESSAGE.UNFOLLOW_USER_SUCCESS,
    result: result
  })
}

export const updateAvatarUserController = async (req: Request, res: Response) => {
  const user = req.decoded_authorization as TokenPayload
  const file = req.file
  console.log(file)
  const result = await usersService.updateAvatarUserService({
    user_id: user.user_id,
    image: file
  })
  return res.json({
    message: USER_MESSAGE.UPDATE_USER_SUCCESS,
    result: result
  })
}

export const updateCoverAvatarUserController = async (req: Request, res: Response) => {
  const user = req.decoded_authorization as TokenPayload
  const file = req.file
  const result = await usersService.updateCoverAvatarUserService({
    user_id: user.user_id,
    image: file
  })
  return res.json({
    message: USER_MESSAGE.UPDATE_USER_SUCCESS,
    result: result
  })
}

export const updateUserController = async (req: Request, res: Response) => {
  const user = req.decoded_authorization as TokenPayload
  const { name, user_name, birthday, address } = req.body
  const result = await usersService.updateUserService({
    user_id: user.user_id,
    name: name,
    user_name: user_name,
    birthday: new Date(birthday),
    address: address
  })
  return res.json({
    message: USER_MESSAGE.UPDATE_USER_SUCCESS,
    result: result
  })
}

export const updatePasswordUserController = async (req: Request, res: Response) => {
  const user = req.decoded_authorization as TokenPayload
  const { old_password, new_password } = req.body
  const result = await usersService.changePasswordService({
    user_id: user.user_id,
    old_password: old_password,
    new_password: new_password
  })
  return res.json({
    message: USER_MESSAGE.UPDATE_PASSWORD_SUCCESS,
    result: result
  })
}

export const getBookmarkedUserController = async (req: Request, res: Response) => {
  const user = req.decoded_authorization as TokenPayload
  const result = await usersService.getBookmarkedUserService({
    user_id: user.user_id
  })
  return res.json({
    message: USER_MESSAGE.GET_BOOKMARKED_SUCCESS,
    result: result
  })
}

export const recommendUsersController = async (req: Request, res: Response) => {
  const user = req.decoded_authorization as TokenPayload
  const result = await usersService.recommendUsersService({
    user_id: user.user_id
  })
  return res.json({
    message: USER_MESSAGE.RECOMMEND_USER_SUCCESS,
    result: result
  })
}

export const requestUpgradeToChefController = async (req: Request, res: Response) => {
  const user = req.decoded_authorization as TokenPayload
  const { reason, proof } = req.body
  const result = await usersService.requestUpgradeToChefService({
    user_id: user.user_id,
    reason: reason,
    proof: proof
  })
  return res.json({
    message: USER_MESSAGE.REQUEST_UPGRADE_SUCCESS,
    result: result
  })
}
