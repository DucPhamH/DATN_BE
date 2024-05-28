import { NextFunction, Request, Response } from 'express'
import { DifficultLevel, ProcessingRecipe, RegionRecipe, UnitValue } from '~/constants/enums'
import HTTP_STATUS from '~/constants/httpStatus'
import { RECIPE_MESSAGE } from '~/constants/messages'
import { ErrorWithStatus } from '~/utils/error'

export const createRecipeValidator = () => {
  return (req: Request, res: Response, next: NextFunction) => {
    // energy,
    // protein,
    // fat,
    // carbohydrate,
    // unit,
    // quantity,
    const {
      title,
      description,
      content,
      time,
      region,
      difficult_level,
      processing_food,
      energy,
      protein,
      fat,
      carbohydrate,
      unit,
      quantity
    } = req.body

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

    //   energy,
    // protein,
    // fat,
    // carbohydrate,
    // unit,
    // quantity,

    if (isNaN(Number(energy))) {
      throw new ErrorWithStatus({
        message: RECIPE_MESSAGE.ENERGY_INVALID,
        status: HTTP_STATUS.UNPROCESSABLE_ENTITY
      })
    }
    if (isNaN(Number(protein))) {
      throw new ErrorWithStatus({
        message: RECIPE_MESSAGE.PROTEIN_INVALID,
        status: HTTP_STATUS.UNPROCESSABLE_ENTITY
      })
    }

    if (isNaN(Number(fat))) {
      throw new ErrorWithStatus({
        message: RECIPE_MESSAGE.FAT_INVALID,
        status: HTTP_STATUS.UNPROCESSABLE_ENTITY
      })
    }

    if (isNaN(Number(carbohydrate))) {
      throw new ErrorWithStatus({
        message: RECIPE_MESSAGE.CARBOHYDRATE_INVALID,
        status: HTTP_STATUS.UNPROCESSABLE_ENTITY
      })
    }

    if (!Object.values(UnitValue).includes(unit)) {
      throw new ErrorWithStatus({
        message: RECIPE_MESSAGE.UNIT_INVALID,
        status: HTTP_STATUS.UNPROCESSABLE_ENTITY
      })
    }

    if (isNaN(Number(quantity))) {
      throw new ErrorWithStatus({
        message: RECIPE_MESSAGE.QUANTITY_INVALID,
        status: HTTP_STATUS.UNPROCESSABLE_ENTITY
      })
    }

    return next()
  }
}
