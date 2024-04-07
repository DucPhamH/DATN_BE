import { checkSchema } from 'express-validator'
import { POST_MESSAGE } from '~/constants/messages'

import { validate } from '~/utils/validation'

export const limitAndPageValidator = validate(
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

export const commentPostValidator = validate(
  checkSchema(
    {
      post_id: {
        notEmpty: true,
        isString: true,
        trim: true
      },
      content: {
        notEmpty: true,
        isString: true,
        trim: true,
        custom: {
          options: (value) => {
            if (value === '') {
              throw new Error(POST_MESSAGE.COMMENT_MUST_NOT_BE_EMPTY)
            }
            return true
          }
        }
      },
      parent_comment_id: {
        isString: true,
        optional: true,
        trim: true
      }
    },
    ['body']
  )
)
