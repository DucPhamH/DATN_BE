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
