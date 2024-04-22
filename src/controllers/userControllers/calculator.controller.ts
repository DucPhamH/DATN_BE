import { Request, Response } from 'express'
import { CALCULATOR_MESSAGE } from '~/constants/messages'
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

export const calculateBMIController = async (req: Request, res: Response) => {
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

export const calculateBMRController = async (req: Request, res: Response) => {
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

export const calculateTDEEController = async (req: Request, res: Response) => {
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

export const calculateBodyFatController = async (req: Request, res: Response) => {
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

export const calculateLBMController = async (req: Request, res: Response) => {
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

export const calculateCalorieBurnedController = async (req: Request, res: Response) => {
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

export const calculateWaterIntakeController = async (req: Request, res: Response) => {
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

export const calculateIBWController = async (req: Request, res: Response) => {
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
