import { Router } from 'express'
import {
  calculateBMIController,
  calculateBMRController,
  calculateBodyFatController,
  calculateCalorieBurnedController,
  calculateIBWController,
  calculateLBMController,
  calculateTDEEController,
  calculateWaterIntakeController,
  saveBMIController,
  saveBMRController,
  saveBodyFatController,
  saveIBWController,
  saveLBMController,
  saveTDEEController
} from '~/controllers/userControllers/calculator.controller'
import { accessTokenValidator } from '~/middlewares/authUser.middleware'
import {
  activityValidator,
  calculateBMIValidator,
  calculateBMRValidator,
  calculateBodyFatValidator,
  calculateCalorieBurnedValidator,
  calculateIBWValidator,
  calculateLBMValidator,
  calculateWaterIntakeValidator
} from '~/middlewares/calculator.middlewares'
import { wrapRequestHandler } from '~/utils/handler'

const calculatorsRouter = Router()

calculatorsRouter.post('/bmi', calculateBMIValidator, wrapRequestHandler(calculateBMIController))
calculatorsRouter.post('/bmr', calculateBMRValidator, wrapRequestHandler(calculateBMRController))
calculatorsRouter.post('/tdee', calculateBMRValidator, activityValidator, wrapRequestHandler(calculateTDEEController))
calculatorsRouter.post('/body-fat', calculateBodyFatValidator, wrapRequestHandler(calculateBodyFatController))
calculatorsRouter.post('/ibw', calculateIBWValidator, wrapRequestHandler(calculateIBWController))
calculatorsRouter.post(
  '/water-intake',
  calculateWaterIntakeValidator,
  wrapRequestHandler(calculateWaterIntakeController)
)
calculatorsRouter.post(
  '/calorie-burned',
  calculateCalorieBurnedValidator,
  wrapRequestHandler(calculateCalorieBurnedController)
)
calculatorsRouter.post('/lbm', calculateLBMValidator, wrapRequestHandler(calculateLBMController))

calculatorsRouter.post('/bmi/save', accessTokenValidator, calculateBMIValidator, wrapRequestHandler(saveBMIController))
calculatorsRouter.post('/bmr/save', accessTokenValidator, calculateBMRValidator, wrapRequestHandler(saveBMRController))
calculatorsRouter.post(
  '/tdee/save',
  accessTokenValidator,
  calculateBMRValidator,
  activityValidator,
  wrapRequestHandler(saveTDEEController)
)
calculatorsRouter.post(
  '/body-fat/save',
  accessTokenValidator,
  calculateBodyFatValidator,
  wrapRequestHandler(saveBodyFatController)
)
calculatorsRouter.post('/lbm/save', accessTokenValidator, calculateLBMValidator, wrapRequestHandler(saveLBMController))
calculatorsRouter.post('/ibw/save', accessTokenValidator, calculateIBWValidator, wrapRequestHandler(saveIBWController))

export default calculatorsRouter
