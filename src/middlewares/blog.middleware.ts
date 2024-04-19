import { checkSchema } from 'express-validator'
import { BLOG_MESSAGE } from '~/constants/messages'

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

export const updateBlogForChefValidator = validate(
  checkSchema(
    {
      title: {
        optional: true,
        isString: true,
        trim: true
      },
      content: {
        optional: true,
        isString: true,
        trim: true
      },
      description: {
        optional: true,
        isString: true,
        trim: true
      },
      image: {
        optional: true,
        isString: true,
        trim: true,
        isURL: true
      },
      category_blog_id: {
        optional: true,
        isString: true,
        trim: true
      }
    },
    ['body']
  )
)

export const getListBlogsForChefValidator = validate(
  checkSchema(
    {
      page: {
        optional: true,
        isInt: true,
        toInt: true
      },
      limit: {
        optional: true,
        isInt: true,
        toInt: true
      },
      sort: {
        optional: true,
        isString: true,
        trim: true
      },
      status: {
        optional: true,
        isString: true,
        trim: true
      },
      search: {
        optional: true,
        isString: true,
        trim: true
      },
      category_blog_id: {
        optional: true,
        isString: true,
        trim: true
      }
    },
    ['query']
  )
)

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

export const commentBlogValidator = validate(
  checkSchema(
    {
      blog_id: {
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
              throw new Error(BLOG_MESSAGE.COMMENT_MUST_NOT_BE_EMPTY)
            }
            return true
          }
        }
      }
    },
    ['body']
  )
)
