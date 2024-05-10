import { checkSchema } from 'express-validator'
import { PurposeValue } from '~/constants/enums'
import { MEAL_MESSAGE } from '~/constants/messages'
import { validate } from '~/utils/validation'

export const createMealScheduleValidator = validate(
  checkSchema(
    {
      name: {
        notEmpty: true,
        isString: true,
        trim: true
      },
      weight_target: {
        optional: true,
        isNumeric: true,
        custom: {
          options: (value) => {
            if (value < 0) throw new Error(MEAL_MESSAGE.WEIGHT_TARGET_INVALID)
            return true
          }
        }
      },
      purpose: {
        notEmpty: true,
        isNumeric: true,
        custom: {
          options: (value) => {
            if (!Object.values(PurposeValue).includes(Number(value))) {
              throw new Error(MEAL_MESSAGE.PURPOSE_INVALID)
            }
            return true
          }
        }
      },
      // start date phải là ngày hôm nay hoặc sau ngày hôm nay và start date phải trước hoặc bằng end date
      start_date: {
        notEmpty: true,
        custom: {
          options: (value, { req }) => {
            const { end_date } = req.body
            // nếu value là string ko thuộc định dạng date thì new Date(value) sẽ trả về invalid date
            if (isNaN(new Date(value).getTime())) throw new Error(MEAL_MESSAGE.START_DATE_INVALID)
            // chỉ lấy ngày của value để so sánh với ngày hôm nay , nếu value < ngày hôm nay thì throw error
            if (new Date(value).setHours(0, 0, 0, 0) < new Date().setHours(0, 0, 0, 0))
              throw new Error(MEAL_MESSAGE.START_DATE_INVALID)
            if (new Date(value) > new Date(end_date)) {
              throw new Error(MEAL_MESSAGE.START_DATE_INVALID)
            }
            return true
          }
        }
      },
      // end date phải sau ngày hôm nay và end date phải sau start date
      //
      end_date: {
        notEmpty: true,
        custom: {
          options: (value, { req }) => {
            const { start_date } = req.body
            if (isNaN(new Date(value).getTime())) throw new Error(MEAL_MESSAGE.END_DATE_INVALID)

            if (new Date(value).setHours(0, 0, 0, 0) < new Date().setHours(0, 0, 0, 0)) {
              throw new Error(MEAL_MESSAGE.END_DATE_INVALID)
            }
            if (new Date(value) < new Date(start_date)) {
              throw new Error(MEAL_MESSAGE.END_DATE_INVALID)
            }
            return true
          }
        }
      }
    },
    ['body']
  )
)

export const updateMealScheduleValidator = validate(
  checkSchema(
    {
      name: {
        optional: true,
        isString: true,
        trim: true
      },
      weight_target: {
        optional: true,
        isNumeric: true,
        custom: {
          options: (value) => {
            if (value < 0) throw new Error(MEAL_MESSAGE.WEIGHT_TARGET_INVALID)
            return true
          }
        }
      },
      purpose: {
        optional: true,
        isNumeric: true,
        custom: {
          options: (value) => {
            if (!Object.values(PurposeValue).includes(Number(value))) {
              throw new Error(MEAL_MESSAGE.PURPOSE_INVALID)
            }
            return true
          }
        }
      },
      end_date: {
        optional: true,
        custom: {
          options: (value, { req }) => {
            const { start_date } = req.body
            if (isNaN(new Date(value).getTime())) throw new Error(MEAL_MESSAGE.END_DATE_INVALID)

            if (new Date(value).setHours(0, 0, 0, 0) < new Date().setHours(0, 0, 0, 0)) {
              throw new Error(MEAL_MESSAGE.END_DATE_INVALID)
            }
            if (new Date(value) < new Date(start_date)) {
              throw new Error(MEAL_MESSAGE.END_DATE_INVALID)
            }
            return true
          }
        }
      }
    },
    ['body']
  )
)
