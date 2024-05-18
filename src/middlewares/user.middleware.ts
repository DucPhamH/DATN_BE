import { checkSchema } from 'express-validator'
import { AUTH_USER_MESSAGE, USER_MESSAGE } from '~/constants/messages'
import UserModel from '~/models/schemas/user.schema'
import { validate } from '~/utils/validation'

export const followValidator = validate(
  checkSchema(
    {
      follow_id: {
        notEmpty: true,
        isString: true,
        trim: true,
        custom: {
          options: async (value) => {
            const user = await UserModel.findById(value)
            if (!user) {
              throw new Error(AUTH_USER_MESSAGE.USER_NOT_FOUND)
            }
          }
        }
      }
    },
    ['body']
  )
)

export const updatePasswordValidator = validate(
  checkSchema(
    {
      old_password: {
        notEmpty: true,
        isString: true,
        isLength: {
          options: {
            min: 6,
            max: 50
          }
        }
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
        },
        custom: {
          options: async (value, { req }) => {
            if (value === req.body.old_password) {
              throw new Error(AUTH_USER_MESSAGE.OLD_PASSWORD_NEW_PASSWORD_NOT_SAME)
            }
          }
        }
      }
    },
    ['body']
  )
)

export const updateProfileValidator = validate(
  checkSchema(
    {
      name: {
        optional: true,
        isString: true,
        isLength: {
          options: {
            min: 3,
            max: 50
          }
        },
        trim: true
      },
      user_name: {
        optional: true,
        isString: true,
        isLength: {
          options: {
            min: 3,
            max: 50
          }
        },
        trim: true,
        custom: {
          options: async (value) => {
            const user = await UserModel.findOne({ user_name: value })
            if (user) {
              throw new Error(USER_MESSAGE.USER_NAME_ALREADY_EXISTS)
            }
          }
        }
      },
      birthday: {
        optional: true,
        isString: true,
        toDate: true
      },
      address: {
        optional: true,
        isString: true,
        isLength: {
          options: {
            min: 3,
            max: 50
          }
        },
        trim: true
      }
    },
    ['body']
  )
)

export const requestUpgradeToChefValidator = validate(
  checkSchema(
    {
      reason: {
        optional: true,
        isString: true,
        isLength: {
          options: {
            min: 3
          }
        },
        trim: true
      },
      proof: {
        optional: true,
        isString: true,
        isURL: true,
        isLength: {
          options: {
            min: 3,
            max: 500
          }
        },
        trim: true
      }
    },
    ['body']
  )
)
