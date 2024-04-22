import { checkSchema } from 'express-validator'
import { validate } from '~/utils/validation'

export const getListActivityValidator = validate(
  checkSchema(
    {
      page: {
        optional: true,
        isInt: true
      },
      limit: {
        optional: true,
        isInt: true
      },
      search: {
        optional: true,
        isString: true,
        trim: true
      },
      activity_category_id: {
        optional: true,
        isString: true,
        trim: true
      }
    },
    ['query']
  )
)
