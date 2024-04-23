import { Request, Response } from 'express'
import { CALCULATOR_MESSAGE } from '~/constants/messages'
import { TokenPayload } from '~/models/requests/authUser.request'
import {
  BMIReqBody,
  BMRReqBody,
  BodyFatReqBody,
  CalorieBurnedReqBody,
  IBWReqBody,
  LBMReqBody,
  TDEEReqBody,
  WaterIntakeReqBody
} from '~/models/requests/caculator.request'
import calculatorServices from '~/services/userServices/calculator.services'

export const calculateBMIController = (req: Request, res: Response) => {
  const { weight, height } = req.body as BMIReqBody
  const result = calculatorServices.calculateBMIService({
    weight: Number(weight),
    height: Number(height)
  })

  return res.json({
    message: CALCULATOR_MESSAGE.CALCULATE_BMI_SUCCESS,
    result
  })
}

export const calculateBMRController = (req: Request, res: Response) => {
  const { weight, height, age, gender } = req.body as BMRReqBody
  const result = calculatorServices.calculateBMRService({
    weight: Number(weight),
    height: Number(height),
    age: Number(age),
    gender: gender
  })
  return res.json({
    message: CALCULATOR_MESSAGE.CALCULATE_BMR_SUCCESS,
    result
  })
}

export const calculateTDEEController = (req: Request, res: Response) => {
  const { weight, height, age, gender, activity } = req.body as TDEEReqBody
  const result = calculatorServices.calculateTDEEService({
    weight: Number(weight),
    height: Number(height),
    age: Number(age),
    gender: gender,
    activity: Number(activity)
  })
  return res.json({
    message: CALCULATOR_MESSAGE.CALCULATE_TDDE_SUCCESS,
    result
  })
}

export const calculateBodyFatController = (req: Request, res: Response) => {
  const { height, neck, waist, hip, gender } = req.body as BodyFatReqBody
  const result = calculatorServices.calculateBodyFatService({
    height: Number(height),
    neck: Number(neck),
    waist: Number(waist),
    hip: Number(hip),
    gender: gender
  })
  return res.json({
    message: CALCULATOR_MESSAGE.CALCULATE_BODY_FAT_SUCCESS,
    result
  })
}

export const calculateLBMController = (req: Request, res: Response) => {
  const { weight, height, gender } = req.body as LBMReqBody
  const result = calculatorServices.calculateLBMService({
    weight: Number(weight),
    height: Number(height),
    gender: gender
  })
  return res.json({
    message: CALCULATOR_MESSAGE.CALCULATE_LBM_SUCCESS,
    result
  })
}

export const calculateCalorieBurnedController = (req: Request, res: Response) => {
  const { weight, time, met } = req.body as CalorieBurnedReqBody
  const result = calculatorServices.calculateCalorieBurnedService({
    weight: Number(weight),
    time: Number(time),
    met: Number(met)
  })
  return res.json({
    result,
    message: CALCULATOR_MESSAGE.CALCULATE__CALORIE_BURNED_SUCCESS
  })
}

export const calculateWaterIntakeController = (req: Request, res: Response) => {
  const { weight, time } = req.body as WaterIntakeReqBody
  const result = calculatorServices.calculateWaterIntakeService({
    weight: Number(weight),
    time: Number(time)
  })
  return res.json({
    result,
    message: CALCULATOR_MESSAGE.CALCULATE__WATER_INTAKE_SUCCESS
  })
}

export const calculateIBWController = (req: Request, res: Response) => {
  const { height, gender } = req.body as IBWReqBody
  const result = calculatorServices.calculateIBWService({
    height: Number(height),
    gender: gender
  })
  return res.json({
    result,
    message: CALCULATOR_MESSAGE.CALCULATE_IBW_SUCCESS
  })
}

export const saveBMIController = async (req: Request, res: Response) => {
  const { weight, height, BMI } = req.body
  const user = req.decoded_authorization as TokenPayload
  const result = await calculatorServices.saveBMIService({
    weight: Number(weight),
    height: Number(height),
    BMI: Number(BMI),
    user_id: user.user_id
  })
  return res.json({
    result,
    message: CALCULATOR_MESSAGE.SAVE_BMI_SUCCESS
  })
}

export const saveBMRController = async (req: Request, res: Response) => {
  const { weight, height, age, gender, BMR } = req.body
  const user = req.decoded_authorization as TokenPayload
  const result = await calculatorServices.saveBMRService({
    weight: Number(weight),
    height: Number(height),
    age: Number(age),
    gender: gender,
    BMR: Number(BMR),
    user_id: user.user_id
  })
  return res.json({
    result,
    message: CALCULATOR_MESSAGE.SAVE_BMR_SUCCESS
  })
}

export const saveTDEEController = async (req: Request, res: Response) => {
  const { weight, height, age, gender, activity, TDEE } = req.body
  const user = req.decoded_authorization as TokenPayload
  const result = await calculatorServices.saveTDEEService({
    weight: Number(weight),
    height: Number(height),
    age: Number(age),
    gender: gender,
    activity: Number(activity),
    TDEE: Number(TDEE),
    user_id: user.user_id
  })
  return res.json({
    result,
    message: CALCULATOR_MESSAGE.SAVE_TDEE_SUCCESS
  })
}

export const saveBodyFatController = async (req: Request, res: Response) => {
  const { height, neck, waist, hip, gender, body_fat } = req.body
  const user = req.decoded_authorization as TokenPayload
  const result = await calculatorServices.saveBodyFatService({
    height: Number(height),
    neck: Number(neck),
    waist: Number(waist),
    hip: Number(hip),
    gender: gender,
    body_fat: Number(body_fat),
    user_id: user.user_id
  })
  return res.json({
    result,
    message: CALCULATOR_MESSAGE.SAVE_BODY_FAT_SUCCESS
  })
}

export const saveLBMController = async (req: Request, res: Response) => {
  const { weight, height, gender, LBM } = req.body
  const user = req.decoded_authorization as TokenPayload
  const result = await calculatorServices.saveLBMService({
    weight: Number(weight),
    height: Number(height),
    LBM: Number(LBM),
    gender: gender,
    user_id: user.user_id
  })

  return res.json({
    result,
    message: CALCULATOR_MESSAGE.SAVE_LBM_SUCCESS
  })
}

export const saveIBWController = async (req: Request, res: Response) => {
  const { height, gender, IBW } = req.body
  const user = req.decoded_authorization as TokenPayload
  const result = await calculatorServices.saveIBWService({
    height: Number(height),
    gender: gender,
    IBW: Number(IBW),
    user_id: user.user_id
  })
  return res.json({
    result,
    message: CALCULATOR_MESSAGE.SAVE_IBW_SUCCESS
  })
}
