import { checkSchema } from 'express-validator'
import { JsonWebTokenError } from 'jsonwebtoken'
import { capitalize } from 'lodash'
import HTTP_STATUS from '~/constants/httpStatus'
import { AUTH_USER_MESSAGE } from '~/constants/messages'
import UserModel from '~/models/schemas/user.schema'
import authUserService from '~/services/userServices/authUser.services'
import { comparePassword } from '~/utils/crypto'
import { ErrorWithStatus } from '~/utils/error'
import { verifyToken } from '~/utils/jwt'
import { validate } from '~/utils/validation'
import { Request } from 'express'
import RefreshTokenModel from '~/models/schemas/refreshToken.schema'
import { envConfig } from '~/constants/config'
import { UserRoles, UserStatus } from '~/constants/enums'

export const registerValidator = validate(
  checkSchema(
    {
      name: {
        notEmpty: true,
        isString: true,
        isLength: {
          options: {
            min: 1,
            max: 100
          }
        },
        trim: true
      },
      email: {
        notEmpty: true,
        isEmail: true,
        trim: true,
        custom: {
          options: async (value) => {
            const isExistEmail = await authUserService.checkEmailExist(value)
            if (isExistEmail) {
              throw new Error(AUTH_USER_MESSAGE.EMAIL_ALREADY_EXISTS)
            }
            return true
          }
        }
      },
      password: {
        notEmpty: true,
        isString: true,
        isLength: {
          options: {
            min: 6,
            max: 50
          }
        },
        isStrongPassword: {
          options: {
            minLength: 6,
            minLowercase: 1,
            minUppercase: 1,
            minNumbers: 1,
            minSymbols: 1
          },
          errorMessage: AUTH_USER_MESSAGE.PASSWORD_MUST_BE_STRONG
        }
      }
    },
    ['body']
  )
)

export const loginValidator = validate(
  checkSchema(
    {
      email: {
        isEmail: true,
        trim: true,
        custom: {
          options: async (value, { req }) => {
            const user = await UserModel.findOne({ email: value })
            if (user === null) {
              throw new Error(AUTH_USER_MESSAGE.EMAIL_OR_PASSWORD_INCORRECT)
            }
            if (user.status === UserStatus.banned) {
              throw new Error(AUTH_USER_MESSAGE.ACCOUNT_BANNED)
            }
            const compare = await comparePassword(req.body.password, user.password)
            if (!compare) {
              throw new Error(AUTH_USER_MESSAGE.EMAIL_OR_PASSWORD_INCORRECT)
            }
            return true
          }
        }
      },
      password: {
        notEmpty: true,
        isString: true,
        isLength: {
          options: {
            min: 6,
            max: 50
          }
        }
      }
    },
    ['body']
  )
)

export const loginAdminValidator = validate(
  checkSchema(
    {
      user_name: {
        isString: true,
        trim: true,
        custom: {
          options: async (value, { req }) => {
            const user = await UserModel.findOne({ user_name: value })
            if (user === null) {
              throw new Error(AUTH_USER_MESSAGE.USER_NAME_OR_PASSWORD_INCORRECT)
            }
            if (user.status === UserStatus.banned) {
              throw new Error(AUTH_USER_MESSAGE.ACCOUNT_BANNED)
            }
            if (user.role === UserRoles.user || user.role === UserRoles.chef) {
              throw new Error(AUTH_USER_MESSAGE.USER_NAME_OR_PASSWORD_INCORRECT)
            }
            const compare = await comparePassword(req.body.password, user.password)
            if (!compare) {
              throw new Error(AUTH_USER_MESSAGE.USER_NAME_OR_PASSWORD_INCORRECT)
            }
            return true
          }
        }
      },
      password: {
        notEmpty: true,
        isString: true,
        isLength: {
          options: {
            min: 6,
            max: 50
          }
        }
      }
    },
    ['body']
  )
)

export const accessTokenValidator = validate(
  checkSchema(
    {
      Authorization: {
        notEmpty: true,
        custom: {
          options: async (value: string, { req }) => {
            const access_token = value.split(' ')[1]
            if (!access_token) {
              throw new ErrorWithStatus({
                message: AUTH_USER_MESSAGE.ACCESS_TOKEN_IS_REQUIRED,
                status: HTTP_STATUS.UNAUTHORIZED
              })
            }
            try {
              const decoded_authorization = await verifyToken({
                token: access_token,
                secretOrPublicKey: envConfig.JWT_SECRET_ACCESS_TOKEN
              })
              if (decoded_authorization.status === UserStatus.banned) {
                throw new ErrorWithStatus({
                  message: AUTH_USER_MESSAGE.ACCOUNT_BANNED,
                  status: HTTP_STATUS.UNAUTHORIZED
                })
              }
              ;(req as Request).decoded_authorization = decoded_authorization
            } catch (error) {
              throw new ErrorWithStatus({
                message: capitalize((error as JsonWebTokenError).message),
                status: HTTP_STATUS.UNAUTHORIZED
              })
            }
            return true
          }
        }
      }
    },
    ['headers']
  )
)

export const refreshTokenValidator = validate(
  checkSchema(
    {
      refresh_token: {
        custom: {
          options: async (value: string, { req }) => {
            if (!value) {
              throw new ErrorWithStatus({
                message: AUTH_USER_MESSAGE.REFRESH_TOKEN_IS_REQUIRED,
                status: HTTP_STATUS.UNAUTHORIZED
              })
            }
            try {
              const [decoded_refresh_token, refresh_token] = await Promise.all([
                verifyToken({ token: value, secretOrPublicKey: envConfig.JWT_SECRET_REFRESH_TOKEN }),
                RefreshTokenModel.findOne({ token: value })
              ])
              if (refresh_token === null) {
                throw new ErrorWithStatus({
                  message: AUTH_USER_MESSAGE.USED_REFRESH_TOKEN_OR_NOT_EXIST,
                  status: HTTP_STATUS.UNAUTHORIZED
                })
              }
              if (decoded_refresh_token.status === UserStatus.banned) {
                throw new ErrorWithStatus({
                  message: AUTH_USER_MESSAGE.ACCOUNT_BANNED,
                  status: HTTP_STATUS.UNAUTHORIZED
                })
              }
              ;(req as Request).decoded_refresh_token = decoded_refresh_token
            } catch (error) {
              if (error instanceof JsonWebTokenError) {
                throw new ErrorWithStatus({
                  message: capitalize(error.message),
                  status: HTTP_STATUS.UNAUTHORIZED
                })
              }
              throw error
            }
            return true
          }
        }
      }
    },
    ['body']
  )
)

export const verifyOtpValidator = validate(
  checkSchema(
    {
      otp_code: {
        notEmpty: true,
        isString: true,
        isLength: {
          options: {
            min: 4,
            max: 4
          }
        }
      },
      email: {
        notEmpty: true,
        isEmail: true,
        trim: true
      }
    },
    ['body']
  )
)

export const resetPasswordValidator = validate(
  checkSchema(
    {
      email: {
        notEmpty: true,
        isEmail: true,
        trim: true
      },
      new_password: {
        notEmpty: true,
        isString: true,
        isLength: {
          options: {
            min: 6,
            max: 50
          }
        },
        isStrongPassword: {
          options: {
            minLength: 6,
            minLowercase: 1,
            minUppercase: 1,
            minNumbers: 1,
            minSymbols: 1
          },
          errorMessage: AUTH_USER_MESSAGE.PASSWORD_MUST_BE_STRONG
        }
      },
      otp_code: {
        notEmpty: true,
        isString: true,
        isLength: {
          options: {
            min: 4,
            max: 4
          }
        }
      }
    },
    ['body']
  )
)
