import { checkSchema } from 'express-validator'
import { AUTH_USER_MESSAGE } from '~/constants/messages'
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
