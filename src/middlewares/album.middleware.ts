import { checkSchema } from 'express-validator'
import { CategoryAlbum } from '~/constants/enums'
import { validate } from '~/utils/validation'

export const createAlbumValidator = validate(
  checkSchema(
    {
      title: {
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
        trim: true
      },
      category_album: {
        notEmpty: true,
        isString: true,
        trim: true,
        custom: {
          options: (value) => {
            return Object.values(CategoryAlbum).includes(value)
          }
        }
      },
      array_recipes_id: {
        notEmpty: true,
        isArray: true
      }
    },
    ['body']
  )
)

export const getListAlbumForChefValidator = validate(
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
      category_album: {
        optional: true,
        isString: true,
        trim: true
      }
    },
    ['query']
  )
)
