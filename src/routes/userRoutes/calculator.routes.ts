import { Router } from 'express'
import {
  calculateBMIController,
  calculateBMRController,
  calculateBodyFatController,
  calculateCalorieBurnedController,
  calculateIBWController,
  calculateLBMController,
  calculateTDEEController,
  calculateWaterIntakeController
} from '~/controllers/userControllers/calculator.controller'
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

export default calculatorsRouter
