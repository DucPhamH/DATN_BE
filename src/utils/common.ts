import { AUTH_USER_MESSAGE } from '~/constants/messages'
import { ErrorWithStatus } from './error'
import { verifyToken } from './jwt'
import HTTP_STATUS from '~/constants/httpStatus'
import { Request } from 'express'
import { capitalize } from 'lodash'
import { JsonWebTokenError } from 'jsonwebtoken'
import { envConfig } from '~/constants/config'

export const verifyAccessToken = async (access_token: string, req?: Request) => {
  if (!access_token) {
    throw new ErrorWithStatus({
      message: AUTH_USER_MESSAGE.ACCESS_TOKEN_REQUIRED,
      status: HTTP_STATUS.UNAUTHORIZED
    })
  }
  try {
    const decoded_authorization = await verifyToken({
      token: access_token,
      secretOrPublicKey: envConfig.JWT_SECRET_ACCESS_TOKEN
    })
    if (req) {
      ;(req as Request).decoded_authorization = decoded_authorization
      return true
    }
    return decoded_authorization
  } catch (error) {
    throw new ErrorWithStatus({
      message: capitalize((error as JsonWebTokenError).message),
      status: HTTP_STATUS.UNAUTHORIZED
    })
  }
}
