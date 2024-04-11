import { checkSchema } from 'express-validator'

import { validate } from '~/utils/validation'

export const createBlogValidator = validate(
  checkSchema(
    {
      title: {
        notEmpty: true,
        isString: true,
        trim: true
      },
      content: {
        notEmpty: true,
        isString: true,
        trim: true
      },
      description: {
        notEmpty: true,
        isString: true,
        trim: true
      },
      image: {
        notEmpty: true,
        isString: true,
        trim: true,
        isURL: true
      },
      category_blog_id: {
        notEmpty: true,
        isString: true,
        trim: true
      }
    },
    ['body']
  )
)
