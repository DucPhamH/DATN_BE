import { checkSchema } from 'express-validator'

import { validate } from '~/utils/validation'

export const newFeedsValidator = validate(
  checkSchema(
    {
      page: {
        in: ['query'],
        isInt: true,
        toInt: true,
        optional: true
      },
      limit: {
        in: ['query'],
        isInt: true,
        toInt: true,
        optional: true
      }
    },
    ['query']
  )
)
