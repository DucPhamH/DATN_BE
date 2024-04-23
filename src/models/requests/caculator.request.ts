export interface BMIReqBody {
  height: number
  weight: number
}

export interface BMRReqBody {
  weight: number
  height: number
  age: number
  gender: string
}

export interface TDEEReqBody {
  weight: number
  height: number
  age: number
  gender: string
  activity: number
}

export interface BodyFatReqBody {
  height: number
  neck: number
  waist: number
  hip: number
  gender: string
}

export interface LBMReqBody {
  weight: number
  height: number
  gender: string
}

export interface CalorieBurnedReqBody {
  weight: number
  time: number
  met: number
}

export interface WaterIntakeReqBody {
  weight: number
  time: number
}

export interface IBWReqBody {
  height: number
  gender: string
}

export interface SaveBMIReqBody {
  user_id: string
  height: number
  weight: number
  BMI: number
}

export interface SaveBMRReqBody {
  user_id: string
  height: number
  weight: number
  age: number
  gender: string
  BMR: number
}

export interface SaveTDEEReqBody {
  user_id: string
  height: number
  weight: number
  age: number
  gender: string
  activity: number
  TDEE: number
}

export interface SaveBodyFatReqBody {
  user_id: string
  height: number
  neck: number
  waist: number
  hip: number
  gender: string
  body_fat: number
}

export interface SaveLBMReqBody {
  user_id: string
  height: number
  weight: number
  gender: string
  LBM: number
}

export interface SaveIBWReqBody {
  user_id: string
  height: number
  gender: string
  IBW: number
}
