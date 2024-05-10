import { checkSchema } from 'express-validator'
import { WORKOUT_MESSAGE } from '~/constants/messages'

import { validate } from '~/utils/validation'

export const workoutScheduleValidator = validate(
  checkSchema(
    {
      name: {
        notEmpty: true,
        isString: true,
        trim: true
      },
      weight: {
        notEmpty: true,
        isNumeric: true
      },
      calo_target: {
        notEmpty: true,
        isNumeric: true
      },
      // start date phải là ngày hôm nay hoặc sau ngày hôm nay và start date phải trước hoặc bằng end date
      start_date: {
        notEmpty: true,
        custom: {
          options: (value, { req }) => {
            const { end_date } = req.body
            // nếu value là string ko thuộc định dạng date thì new Date(value) sẽ trả về invalid date
            if (isNaN(new Date(value).getTime())) throw new Error(WORKOUT_MESSAGE.START_DATE_INVALID)
            // chỉ lấy ngày của value để so sánh với ngày hôm nay , nếu value < ngày hôm nay thì throw error
            if (new Date(value).setHours(0, 0, 0, 0) < new Date().setHours(0, 0, 0, 0))
              throw new Error(WORKOUT_MESSAGE.START_DATE_INVALID)
            if (new Date(value) > new Date(end_date)) {
              throw new Error(WORKOUT_MESSAGE.START_DATE_INVALID)
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
            if (isNaN(new Date(value).getTime())) throw new Error(WORKOUT_MESSAGE.END_DATE_INVALID)

            if (new Date(value).setHours(0, 0, 0, 0) < new Date().setHours(0, 0, 0, 0)) {
              throw new Error(WORKOUT_MESSAGE.END_DATE_INVALID)
            }
            if (new Date(value) < new Date(start_date)) {
              throw new Error(WORKOUT_MESSAGE.END_DATE_INVALID)
            }
            return true
          }
        }
      }
    },
    ['body']
  )
)

export const updateWorkoutScheduleValidator = validate(
  checkSchema(
    {
      name: {
        notEmpty: true,
        isString: true,
        trim: true
      },
      calo_target: {
        notEmpty: true,
        isNumeric: true
      },
      end_date: {
        notEmpty: true,
        custom: {
          options: (value) => {
            if (isNaN(new Date(value).getTime())) throw new Error(WORKOUT_MESSAGE.END_DATE_INVALID)

            if (new Date(value).setHours(0, 0, 0, 0) < new Date().setHours(0, 0, 0, 0)) {
              throw new Error(WORKOUT_MESSAGE.END_DATE_INVALID)
            }
            return true
          }
        }
      }
    },
    ['body']
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
