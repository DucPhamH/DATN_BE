// viết hàm check role nhận vào 1 array các role. nếu user có role nào trong array thì cho qua
import { Request, Response, NextFunction } from 'express'
import HTTP_STATUS from '~/constants/httpStatus'
import { AUTH_USER_MESSAGE } from '~/constants/messages'
import { ErrorWithStatus } from '~/utils/error'

export const checkRole = (roles: number[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = req.decoded_authorization
    if (user && roles.includes(user.role)) {
      return next()
    }
    throw new ErrorWithStatus({
      message: AUTH_USER_MESSAGE.UNAUTHORIZED,
      status: HTTP_STATUS.FORBIDDEN
    })
  }
}
