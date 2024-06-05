import { Request, Response } from 'express'
import { ADMIN_MESSAGE } from '~/constants/messages'
import userAdminService from '~/services/adminServices/userAdmin.services'

export const getAllUserController = async (req: Request, res: Response) => {
  const { page, limit, role, status, search, sort } = req.query
  const result = await userAdminService.getAllUserService({
    page: Number(page),
    limit: Number(limit),
    role: Number(role),
    status: Number(status),
    search: search as string,
    sort: sort as string
  })

  return res.json({
    result,
    message: ADMIN_MESSAGE.GET_ALL_USER_SUCCESS
  })
}

export const getUserByIdController = async (req: Request, res: Response) => {
  const { id } = req.params
  const result = await userAdminService.getUserByIdService(id)

  return res.json({
    result,
    message: ADMIN_MESSAGE.GET_USER_BY_ID_SUCCESS
  })
}

export const deleteUserByIdController = async (req: Request, res: Response) => {
  const { id } = req.params
  const result = await userAdminService.deleteUserByIdService(id)

  return res.json({
    result,
    message: ADMIN_MESSAGE.DELETE_USER_BY_ID_SUCCESS
  })
}

export const banUserByIdController = async (req: Request, res: Response) => {
  const { user_id } = req.body
  const result = await userAdminService.banUserByIdService(user_id)

  return res.json({
    result,
    message: ADMIN_MESSAGE.BAN_USER_BY_ID_SUCCESS
  })
}

export const unbanUserByIdController = async (req: Request, res: Response) => {
  const { user_id } = req.body
  const result = await userAdminService.unbanUserByIdService(user_id)

  return res.json({
    result,
    message: ADMIN_MESSAGE.UNBAN_USER_BY_ID_SUCCESS
  })
}

export const createWritterAndInspectorController = async (req: Request, res: Response) => {
  const { name, email, user_name, role } = req.body
  const result = await userAdminService.createWritterAndInspectorService({
    name,
    email,
    user_name,
    role: Number(role)
  })

  return res.json({
    result,
    message: ADMIN_MESSAGE.CREATE_WRITTER_AND_INSPECTOR_SUCCESS
  })
}

export const getRequestUpgradeController = async (req: Request, res: Response) => {
  const { page, limit, search, type } = req.query
  const result = await userAdminService.getRequestUpgradeService({
    page: Number(page),
    limit: Number(limit),
    search: search as string,
    type: Number(type)
  })

  return res.json({
    result,
    message: ADMIN_MESSAGE.GET_REQUEST_UPGRADE_SUCCESS
  })
}

export const rejectRequestUpgradeController = async (req: Request, res: Response) => {
  const { user_id } = req.body
  const result = await userAdminService.rejectRequestUpgradeService(user_id)

  return res.json({
    result,
    message: ADMIN_MESSAGE.REJECT_REQUEST_UPGRADE_SUCCESS
  })
}

export const acceptRequestUpgradeController = async (req: Request, res: Response) => {
  const { user_id } = req.body
  const result = await userAdminService.acceptRequestUpgradeService(user_id)

  return res.json({
    result,
    message: ADMIN_MESSAGE.ACCEPT_REQUEST_UPGRADE_SUCCESS
  })
}

export const dashboardController = async (req: Request, res: Response) => {
  const result = await userAdminService.dashboardService()
  return res.json({
    result,
    message: ADMIN_MESSAGE.GET_DASHBROAD_SUCCESS
  })
}
