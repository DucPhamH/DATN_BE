import { checkSchema } from 'express-validator'
import { UserRoles, UserStatus } from '~/constants/enums'
import { AUTH_USER_MESSAGE } from '~/constants/messages'
import UserModel from '~/models/schemas/user.schema'
import { comparePassword } from '~/utils/crypto'
import { validate } from '~/utils/validation'

export const loginAdminValidator = validate(
  checkSchema(
    {
      user_name: {
        isString: true,
        trim: true,
        custom: {
          options: async (value, { req }) => {
            const user = await UserModel.findOne({ user_name: value })
            console.log(user)
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
