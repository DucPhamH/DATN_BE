import { checkSchema } from 'express-validator'
import { UserRoles } from '~/constants/enums'
import { ADMIN_MESSAGE } from '~/constants/messages'
import userAdminService from '~/services/adminServices/userAdmin.services'
import { validate } from '~/utils/validation'

export const createWritterAndInspectorValidator = validate(
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
            const isExistEmail = await userAdminService.checkEmailExist(value)
            if (isExistEmail) {
              throw new Error(ADMIN_MESSAGE.EMAIL_ALREADY_EXISTS)
            }
            return true
          }
        }
      },
      user_name: {
        notEmpty: true,
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
            const isExistUserName = await userAdminService.checkUserNameExist(value)
            if (isExistUserName) {
              throw new Error(ADMIN_MESSAGE.USER_NAME_ALREADY_EXISTS)
            }
            return true
          }
        }
      },
      role: {
        notEmpty: true,
        isInt: true,
        custom: {
          options: (value) => {
            if (!Object.values(UserRoles).includes(Number(value))) {
              throw new Error(ADMIN_MESSAGE.ROLE_INVALID)
            }
            return true
          }
        }
      }
    },
    ['body']
  )
)
