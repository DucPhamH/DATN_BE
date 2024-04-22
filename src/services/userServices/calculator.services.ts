import { UserGender } from '~/constants/enums'
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

class CalculatorServices {
  private BMICalculator(weight: number, height: number) {
    // làm tròn 1 chữ số thập phân
    return parseFloat((weight / (height * height)).toFixed(1))
  }
  private BMRCalculator(weight: number, height: number, age: number, gender: string) {
    if (gender === UserGender.male) {
      return parseFloat((9.99 * weight + 6.25 * height - 4.92 * age + 5).toFixed(1))
    }
    if (gender === UserGender.female) {
      return parseFloat((9.99 * weight + 6.25 * height - 4.92 * age - 161).toFixed(1))
    }
  }
  private TDEECalculator(weight: number, height: number, age: number, gender: string, activity: number) {
    const BMR = this.BMRCalculator(weight, height, age, gender) || 0
    return parseFloat((BMR * activity).toFixed(1))
  }
  private BodyFatCalculator(height: number, neck: number, waist: number, hip: number, gender: string) {
    if (gender === UserGender.male) {
      return parseFloat(
        (495 / (1.0324 - 0.19077 * Math.log10(waist - neck) + 0.15456 * Math.log10(height)) - 450).toFixed(1)
      )
    }
    if (gender === UserGender.female) {
      console.log(1.29579 - 0.35004 * Math.log10(waist + hip - neck) + 0.221 * Math.log10(height))
      return parseFloat(
        (495 / (1.29579 - 0.35004 * Math.log10(waist + hip - neck) + 0.221 * Math.log10(height)) - 450).toFixed(1)
      )
    }
  }
  private LBMCalculator(weight: number, height: number, gender: string) {
    // công thức hume
    if (gender === UserGender.male) {
      return parseFloat((0.3281 * weight + 0.33929 * height - 29.5336).toFixed(1))
    }
    if (gender === UserGender.female) {
      return parseFloat((0.29569 * weight + 0.41813 * height - 43.2933).toFixed(1))
    }
  }
  private CalorieBurnedCalculator(weight: number, time: number, met: number) {
    // (MET x 3.5 x cân nặng(kg)) / 200 x thời gian tập luyện (phút) = lượng calo tiêu hao
    const caloriePerMinutes = (met * 3.5 * weight) / 200
    return parseFloat((caloriePerMinutes * time).toFixed(1))
  }
  private WaterIntakeCalculator(weight: number, time: number) {
    //[Cân nặng(kg) + (Thời gian luyện tập/30 phút x 12 oz)] x 0.03 lít = Lượng nước (lít).
    return parseFloat(((weight + (time / 30) * 12) * 0.03).toFixed(1))
  }
  private IBWCalculator(height: number, gender: string) {
    //Nam giới: 50,0 kg + 2,3 kg mỗi inch trên 5 feet
    // Nữ giới: 45,5 kg + 2,3 kg mỗi inch trên 5 feet

    // 1 feet = 30.48 cm = 12 inch
    // 1 cm = 0.393701 inch
    //height = cm
    const feet = height / 30.48

    if (gender === UserGender.male) {
      return parseFloat((50 + 2.3 * ((feet - 5) * 12)).toFixed(1))
    }
    if (gender === UserGender.female) {
      return parseFloat((45.5 + 2.3 * ((feet - 5) * 12)).toFixed(1))
    }
  }

  calculateBMIService({ weight, height }: BMIReqBody) {
    return this.BMICalculator(weight, height)
  }
  calculateBMRService({ weight, height, age, gender }: BMRReqBody) {
    return this.BMRCalculator(weight, height, age, gender)
  }
  calculateTDEEService({ weight, height, age, gender, activity }: TDEEReqBody) {
    return this.TDEECalculator(weight, height, age, gender, activity)
  }
  calculateBodyFatService({ height, neck, waist, hip, gender }: BodyFatReqBody) {
    return this.BodyFatCalculator(height, neck, waist, hip, gender)
  }
  calculateLBMService({ weight, height, gender }: LBMReqBody) {
    return this.LBMCalculator(weight, height, gender)
  }
  calculateCalorieBurnedService({ weight, time, met }: CalorieBurnedReqBody) {
    return this.CalorieBurnedCalculator(weight, time, met)
  }
  calculateWaterIntakeService({ weight, time }: WaterIntakeReqBody) {
    return this.WaterIntakeCalculator(weight, time)
  }
  calculateIBWService({ height, gender }: IBWReqBody) {
    return this.IBWCalculator(height, gender)
  }
}

const calculatorServices = new CalculatorServices()
export default calculatorServices
