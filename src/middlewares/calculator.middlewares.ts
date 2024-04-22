import { checkSchema } from 'express-validator'
import { ActivityValue, UserGender } from '~/constants/enums'
import { CALCULATOR_MESSAGE } from '~/constants/messages'
import { validate } from '~/utils/validation'

export const calculateBMIValidator = validate(
  checkSchema(
    {
      height: {
        notEmpty: true,
        isNumeric: true,
        toFloat: true,
        trim: true,
        custom: {
          options: (value) => {
            if (value <= 0) {
              throw new Error(CALCULATOR_MESSAGE.HEIGHT_MUST_GREATER_THAN_0)
            }
            return true
          }
        }
      },
      weight: {
        notEmpty: true,
        isNumeric: true,
        toFloat: true,
        trim: true
      }
    },
    ['body']
  )
)

export const calculateBMRValidator = validate(
  checkSchema(
    {
      weight: {
        notEmpty: true,
        isNumeric: true,
        toFloat: true,
        trim: true,
        custom: {
          options: (value) => {
            if (value <= 0) {
              throw new Error(CALCULATOR_MESSAGE.WEIGHT_MUST_GREATER_THAN_0)
            }
            return true
          }
        }
      },
      height: {
        notEmpty: true,
        isNumeric: true,
        toFloat: true,
        trim: true,
        custom: {
          options: (value) => {
            if (value <= 0) {
              throw new Error(CALCULATOR_MESSAGE.HEIGHT_MUST_GREATER_THAN_0)
            }
            return true
          }
        }
      },
      age: {
        notEmpty: true,
        isNumeric: true,
        toInt: true,
        trim: true,
        custom: {
          options: (value) => {
            if (value <= 0) {
              throw new Error(CALCULATOR_MESSAGE.AGE_MUST_GREATER_THAN_0)
            }
            return true
          }
        }
      },
      gender: {
        notEmpty: true,
        isString: true,
        trim: true,
        custom: {
          options: (value) => {
            if (value === UserGender.male) {
              return true
            }
            if (value === UserGender.female) {
              return true
            }
            throw new Error(CALCULATOR_MESSAGE.GENDER_MUST_BE_MALE_OR_FEMALE)
          }
        }
      }
    },
    ['body']
  )
)

export const activityValidator = validate(
  checkSchema(
    {
      activity: {
        notEmpty: true,
        isNumeric: true,
        toFloat: true,
        trim: true,
        custom: {
          options: (value) => {
            // acctivity phai thuoc 1 trong cac muc cua ActivityValue

            if (!Object.values(ActivityValue).includes(parseFloat(value))) {
              throw new Error(CALCULATOR_MESSAGE.ACTIVITY_MUST_BE_IN_ACTIVITY_VALUE)
            }
            return true
          }
        }
      }
    },
    ['body']
  )
)

export const calculateBodyFatValidator = validate(
  checkSchema(
    {
      height: {
        notEmpty: true,
        isNumeric: true,
        toFloat: true,
        trim: true,
        custom: {
          options: (value) => {
            if (value <= 0) {
              throw new Error(CALCULATOR_MESSAGE.HEIGHT_MUST_GREATER_THAN_0)
            }
            return true
          }
        }
      },
      neck: {
        notEmpty: true,
        toFloat: true,
        isNumeric: true,
        trim: true
      },
      waist: {
        notEmpty: true,
        toFloat: true,
        isNumeric: true,
        trim: true
      },
      hip: {
        notEmpty: true,
        toFloat: true,
        isNumeric: true,
        trim: true
      },
      gender: {
        notEmpty: true,
        isString: true,
        trim: true,
        custom: {
          options: (value) => {
            if (value === UserGender.male) {
              return true
            }
            if (value === UserGender.female) {
              return true
            }
            throw new Error(CALCULATOR_MESSAGE.GENDER_MUST_BE_MALE_OR_FEMALE)
          }
        }
      }
    },
    ['body']
  )
)

export const calculateLBMValidator = validate(
  checkSchema(
    {
      height: {
        notEmpty: true,
        isNumeric: true,
        toFloat: true,
        trim: true,
        custom: {
          options: (value) => {
            if (value <= 0) {
              throw new Error(CALCULATOR_MESSAGE.HEIGHT_MUST_GREATER_THAN_0)
            }
            return true
          }
        }
      },
      weight: {
        notEmpty: true,
        isNumeric: true,
        toFloat: true,
        trim: true,
        custom: {
          options: (value) => {
            if (value <= 0) {
              throw new Error(CALCULATOR_MESSAGE.WEIGHT_MUST_GREATER_THAN_0)
            }
            return true
          }
        }
      },
      gender: {
        notEmpty: true,
        isString: true,
        trim: true,
        custom: {
          options: (value) => {
            if (value === UserGender.male) {
              return true
            }
            if (value === UserGender.female) {
              return true
            }
            throw new Error(CALCULATOR_MESSAGE.GENDER_MUST_BE_MALE_OR_FEMALE)
          }
        }
      }
    },
    ['body']
  )
)

export const calculateCalorieBurnedValidator = validate(
  checkSchema(
    {
      weight: {
        notEmpty: true,
        isNumeric: true,
        toFloat: true,
        trim: true,
        custom: {
          options: (value) => {
            if (value <= 0) {
              throw new Error(CALCULATOR_MESSAGE.WEIGHT_MUST_GREATER_THAN_0)
            }
            return true
          }
        }
      },
      time: {
        notEmpty: true,
        isNumeric: true,
        toFloat: true,
        trim: true,
        custom: {
          options: (value) => {
            if (value <= 0) {
              throw new Error(CALCULATOR_MESSAGE.TIME_MUST_GREATER_THAN_0)
            }
            return true
          }
        }
      },
      met: {
        notEmpty: true,
        isNumeric: true,
        toFloat: true,
        trim: true
      }
    },
    ['body']
  )
)

export const calculateWaterIntakeValidator = validate(
  checkSchema(
    {
      weight: {
        notEmpty: true,
        isNumeric: true,
        toFloat: true,
        trim: true,
        custom: {
          options: (value) => {
            if (value <= 0) {
              throw new Error(CALCULATOR_MESSAGE.WEIGHT_MUST_GREATER_THAN_0)
            }
            return true
          }
        }
      },
      time: {
        notEmpty: true,
        isNumeric: true,
        toFloat: true,
        trim: true,
        custom: {
          options: (value) => {
            if (value <= 0) {
              throw new Error(CALCULATOR_MESSAGE.TIME_MUST_GREATER_THAN_0)
            }
            return true
          }
        }
      }
    },
    ['body']
  )
)

export const calculateIBWValidator = validate(
  checkSchema(
    {
      height: {
        notEmpty: true,
        isNumeric: true,
        toFloat: true,
        trim: true,
        custom: {
          options: (value) => {
            if (value <= 0) {
              throw new Error(CALCULATOR_MESSAGE.HEIGHT_MUST_GREATER_THAN_0)
            }
            return true
          }
        }
      },
      gender: {
        notEmpty: true,
        isString: true,
        trim: true,
        custom: {
          options: (value) => {
            if (value === UserGender.male) {
              return true
            }
            if (value === UserGender.female) {
              return true
            }
            throw new Error(CALCULATOR_MESSAGE.GENDER_MUST_BE_MALE_OR_FEMALE)
          }
        }
      }
    },
    ['body']
  )
)
