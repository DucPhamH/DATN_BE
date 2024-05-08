import { NextFunction, Request, Response } from 'express'
import { checkSchema } from 'express-validator'
import { DifficultLevel, ProcessingRecipe, RegionRecipe } from '~/constants/enums'
import HTTP_STATUS from '~/constants/httpStatus'
import { RECIPE_MESSAGE } from '~/constants/messages'
import { ErrorWithStatus } from '~/utils/error'
import { validate } from '~/utils/validation'

export const createRecipeValidator = () => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { title, description, content, time, region, difficult_level, processing_food } = req.body

    if (!title) {
      throw new ErrorWithStatus({
        message: RECIPE_MESSAGE.TITLE_REQUIRED,
        status: HTTP_STATUS.UNPROCESSABLE_ENTITY
      })
    }
    if (!description) {
      throw new ErrorWithStatus({
        message: RECIPE_MESSAGE.DESCRIPTION_REQUIRED,
        status: HTTP_STATUS.UNPROCESSABLE_ENTITY
      })
    }
    if (!content) {
      throw new ErrorWithStatus({
        message: RECIPE_MESSAGE.CONTENT_REQUIRED,
        status: HTTP_STATUS.UNPROCESSABLE_ENTITY
      })
    }

    // nếu time không phải là số
    if (isNaN(Number(time))) {
      throw new ErrorWithStatus({
        message: RECIPE_MESSAGE.TIME_INVALID,
        status: HTTP_STATUS.UNPROCESSABLE_ENTITY
      })
    }

    // nếu region không phải là số và thuộc 1 trong các giá trị của RegionRecipe
    if (isNaN(Number(region)) || !Object.values(RegionRecipe).includes(Number(region))) {
      throw new ErrorWithStatus({
        message: RECIPE_MESSAGE.REGION_INVALID,
        status: HTTP_STATUS.UNPROCESSABLE_ENTITY
      })
    }

    if (isNaN(Number(difficult_level)) || !Object.values(DifficultLevel).includes(Number(difficult_level))) {
      throw new ErrorWithStatus({
        message: RECIPE_MESSAGE.DIFFICULT_LEVEL_INVALID,
        status: HTTP_STATUS.UNPROCESSABLE_ENTITY
      })
    }

    if (!Object.values(ProcessingRecipe).includes(processing_food)) {
      throw new ErrorWithStatus({
        message: RECIPE_MESSAGE.PROCESSING_FOOD_INVALID,
        status: HTTP_STATUS.UNPROCESSABLE_ENTITY
      })
    }
    return next()
  }
}

export const getListRecipeForChefValidator = validate(
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
      category_recipe_id: {
        optional: true,
        isString: true,
        trim: true
      },
      difficult_level: {
        optional: true,
        isInt: true,
        toInt: true
      },
      processing_food: {
        optional: true,
        isString: true,
        trim: true
      },
      region: {
        optional: true,
        isInt: true,
        toInt: true
      },
      interval_time: {
        optional: true,
        isInt: true,
        toInt: true
      }
    },
    ['query']
  )
)

export const getListRecipeForUserValidator = validate(
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
      search: {
        optional: true,
        isString: true,
        trim: true
      },
      category_recipe_id: {
        optional: true,
        isString: true,
        trim: true
      },
      difficult_level: {
        optional: true,
        isInt: true,
        toInt: true
      },
      processing_food: {
        optional: true,
        isString: true,
        trim: true
      },
      region: {
        optional: true,
        isInt: true,
        toInt: true
      },
      interval_time: {
        optional: true,
        isInt: true,
        toInt: true
      },
      type: {
        optional: true,
        isInt: true,
        toInt: true
      }
    },
    ['query']
  )
)
