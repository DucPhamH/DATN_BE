import { omit } from 'lodash'
import { UserGender } from '~/constants/enums'
import HTTP_STATUS from '~/constants/httpStatus'
import { AUTH_USER_MESSAGE } from '~/constants/messages'
import {
  BMIReqBody,
  BMRReqBody,
  BodyFatReqBody,
  CalorieBurnedReqBody,
  IBWReqBody,
  LBMReqBody,
  SaveBMIReqBody,
  SaveBMRReqBody,
  SaveBodyFatReqBody,
  SaveIBWReqBody,
  SaveLBMReqBody,
  SaveTDEEReqBody,
  TDEEReqBody,
  WaterIntakeReqBody
} from '~/models/requests/caculator.request'
import UserModel from '~/models/schemas/user.schema'
import { convertCentimeterToMetter, convertMetterToCentimeter } from '~/utils/convert'
import { ErrorWithStatus } from '~/utils/error'

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
  // những api lưu dữ liệu vào db
  async saveBMIService({ weight, height, BMI, user_id }: SaveBMIReqBody) {
    // save vào db
    const convertHeight = convertMetterToCentimeter(height)

    // tìm user theo id và so sánh weight cũ với weight mới nếu khác thì cập nhật lại weight và thêm weight mới vào pre_weight còn nếu giống nhau thì cập nhập lại date của weight cũ trong pre_weight
    const user = await UserModel.findOne({ _id: user_id })

    if (!user) {
      throw new ErrorWithStatus({
        message: AUTH_USER_MESSAGE.USER_NOT_FOUND,
        status: HTTP_STATUS.NOT_FOUND
      })
    }

    if (user.weight !== weight) {
      const pre_weight = user.pre_weight || []
      //nếu pre_weight > 10 thì xóa phần tử đầu tiên thêm phần tử mới vào cuối mảng

      if (pre_weight.length >= 10) {
        pre_weight.shift()
        pre_weight.push({ weight: weight, date: new Date() })
      } else {
        pre_weight.push({ weight: weight, date: new Date() })
      }
      await UserModel.findByIdAndUpdate(user_id, { weight, height: convertHeight, BMI, pre_weight }, { new: true })
    } else {
      const pre_weight = user.pre_weight || []
      pre_weight[pre_weight.length - 1].date = new Date()
      await UserModel.findByIdAndUpdate(user_id, { weight, height: convertHeight, BMI, pre_weight }, { new: true })
    }

    // const user = await UserModel.findByIdAndUpdate(user_id, { weight, height: convertHeight, BMI }, { new: true })

    // cập nhật lại những chỉ số cùng sử dụng các giá trị với BMI , nếu chỉ số đó mà bằng null tức là chưa tính toán thì sẽ không cập nhật chỉ số đó
    const updateData: Record<string, any> = {}

    // // nếu các chỉ số khác null thì cập nhật
    if (user.BMR !== null) {
      updateData['BMR'] = this.BMRCalculator(weight, convertHeight, user.age as number, user.gender as string)
    }
    if (user.TDEE !== null) {
      updateData['TDEE'] = this.TDEECalculator(
        weight,
        convertHeight,
        user.age as number,
        user.gender as string,
        user.activity_level as number
      )
    }
    if (user.body_fat !== null) {
      updateData['body_fat'] = this.BodyFatCalculator(
        convertHeight,
        user.neck as number,
        user.waist as number,
        user.hip as number,
        user.gender as string
      )
    }
    if (user.IBW !== null) {
      updateData['IBW'] = this.IBWCalculator(convertHeight, user.gender as string)
    }
    if (user.LBM !== null) {
      updateData['LBM'] = this.LBMCalculator(weight, convertHeight, user.gender as string)
    }

    // // cập nhật lại db
    const updatedUser = await UserModel.findByIdAndUpdate(user_id, updateData, { new: true })
    if (updatedUser) {
      return omit(updatedUser.toObject(), ['password', 'upgrade_request'])
    }
  }
  async saveBMRService({ weight, height, age, gender, BMR, user_id }: SaveBMRReqBody) {
    // save vào db
    const convertHeight = convertCentimeterToMetter(height)
    console.log(convertHeight)

    // tìm user theo id và so sánh weight cũ với weight mới nếu khác thì cập nhật lại weight và thêm weight mới vào pre_weight còn nếu giống nhau thì cập nhập lại date của weight cũ trong pre_weight

    const user = await UserModel.findOne({ _id: user_id })

    if (!user) {
      throw new ErrorWithStatus({
        message: AUTH_USER_MESSAGE.USER_NOT_FOUND,
        status: HTTP_STATUS.NOT_FOUND
      })
    }

    if (user.weight !== weight) {
      const pre_weight = user.pre_weight || []
      // nếu pre_weight > 10 thì xóa phần tử đầu tiên thêm phần tử mới vào cuối mảng

      if (pre_weight.length >= 10) {
        pre_weight.shift()
        pre_weight.push({ weight: weight, date: new Date() })
      } else {
        pre_weight.push({ weight: weight, date: new Date() })
      }
      await UserModel.findByIdAndUpdate(user_id, { weight, height, age, BMR, gender, pre_weight }, { new: true })
    } else {
      const pre_weight = user.pre_weight || []
      pre_weight[pre_weight.length - 1].date = new Date()
      await UserModel.findByIdAndUpdate(user_id, { weight, height, age, BMR, gender, pre_weight }, { new: true })
    }

    // const user = await UserModel.findByIdAndUpdate(user_id, { weight, height, age, BMR, gender }, { new: true })

    // cập nhật lại những chỉ số cùng sử dụng các giá trị với BMR , nếu chỉ số đó mà bằng null tức là chưa tính toán thì sẽ không cập nhật chỉ số đó

    const updateData: Record<string, any> = {}
    // if (!user) {
    //   throw new ErrorWithStatus({
    //     message: AUTH_USER_MESSAGE.USER_NOT_FOUND,
    //     status: HTTP_STATUS.NOT_FOUND
    //   })
    // }

    // nếu các chỉ số khác null thì cập nhật
    if (user.BMI !== null) {
      updateData['BMI'] = this.BMICalculator(weight, convertHeight)
    }
    if (user.TDEE !== null) {
      updateData['TDEE'] = this.TDEECalculator(weight, height, age, gender, user.activity_level as number)
    }
    if (user.body_fat !== null) {
      updateData['body_fat'] = this.BodyFatCalculator(
        height,
        user.neck as number,
        user.waist as number,
        user.hip as number,
        gender
      )
    }
    if (user.IBW !== null) {
      updateData['IBW'] = this.IBWCalculator(height, gender)
    }
    if (user.LBM !== null) {
      updateData['LBM'] = this.LBMCalculator(weight, height, gender)
    }

    // cập nhật lại db
    const updatedUser = await UserModel.findByIdAndUpdate(user_id, updateData, { new: true })
    if (updatedUser) {
      return omit(updatedUser.toObject(), ['password', 'upgrade_request'])
    }
  }
  async saveTDEEService({ weight, height, age, gender, activity, TDEE, user_id }: SaveTDEEReqBody) {
    // save vào db
    const convertHeight = convertCentimeterToMetter(height)

    // tìm user theo id và so sánh weight cũ với weight mới nếu khác thì cập nhật lại weight và thêm weight mới vào pre_weight còn nếu giống nhau thì cập nhập lại date của weight cũ trong pre_weight
    const user = await UserModel.findOne({ _id: user_id })

    if (!user) {
      throw new ErrorWithStatus({
        message: AUTH_USER_MESSAGE.USER_NOT_FOUND,
        status: HTTP_STATUS.NOT_FOUND
      })
    }

    if (user.weight !== weight) {
      const pre_weight = user.pre_weight || []
      // nếu pre_weight > 10 thì xóa phần tử đầu tiên thêm phần tử mới vào cuối mảng

      if (pre_weight.length >= 10) {
        pre_weight.shift()
        pre_weight.push({ weight: weight, date: new Date() })
      } else {
        pre_weight.push({ weight: weight, date: new Date() })
      }

      await UserModel.findByIdAndUpdate(
        user_id,
        { weight, height, age, gender, activity_level: activity, TDEE, pre_weight },
        { new: true }
      )
    } else {
      const pre_weight = user.pre_weight || []
      pre_weight[pre_weight.length - 1].date = new Date()
      await UserModel.findByIdAndUpdate(
        user_id,
        { weight, height, age, gender, activity_level: activity, TDEE, pre_weight },
        { new: true }
      )
    }

    // const user = await UserModel.findByIdAndUpdate(
    //   user_id,
    //   { weight, height, age, gender, activity_level: activity, TDEE },
    //   { new: true }
    // )

    // cập nhật lại những chỉ số cùng sử dụng các giá trị với TDEE , nếu chỉ số đó mà bằng null tức là chưa tính toán thì sẽ không cập nhật chỉ số đó'
    const updateData: Record<string, any> = {}
    // if (!user) {
    //   throw new ErrorWithStatus({
    //     message: AUTH_USER_MESSAGE.USER_NOT_FOUND,
    //     status: HTTP_STATUS.NOT_FOUND
    //   })
    // }

    // nếu các chỉ số khác null thì cập nhật
    if (user.BMI !== null) {
      updateData['BMI'] = this.BMICalculator(weight, convertHeight)
    }

    if (user.BMR !== null) {
      updateData['BMR'] = this.BMRCalculator(weight, height, age, gender)
    }
    if (user.body_fat !== null) {
      updateData['body_fat'] = this.BodyFatCalculator(
        height,
        user.neck as number,
        user.waist as number,
        user.hip as number,
        gender
      )
    }
    if (user.IBW !== null) {
      updateData['IBW'] = this.IBWCalculator(height, gender)
    }
    if (user.LBM !== null) {
      updateData['LBM'] = this.LBMCalculator(weight, height, gender)
    }

    // cập nhật lại db
    const updatedUser = await UserModel.findByIdAndUpdate(user_id, updateData, { new: true })
    if (updatedUser) {
      return omit(updatedUser.toObject(), ['password', 'upgrade_request'])
    }
  }

  async saveBodyFatService({ height, neck, waist, hip, gender, body_fat, user_id }: SaveBodyFatReqBody) {
    // save vào db
    const convertHeight = convertCentimeterToMetter(height)
    const user = await UserModel.findByIdAndUpdate(
      user_id,
      { height, neck, waist, hip, gender, body_fat },
      { new: true }
    )

    // cập nhật lại những chỉ số cùng sử dụng các giá trị với body_fat , nếu chỉ số đó mà bằng null tức là chưa tính toán thì sẽ không cập nhật chỉ số đó'

    const updateData: Record<string, any> = {}

    if (!user) {
      throw new ErrorWithStatus({
        message: AUTH_USER_MESSAGE.USER_NOT_FOUND,
        status: HTTP_STATUS.NOT_FOUND
      })
    }

    // nếu các chỉ số khác null thì cập nhật
    if (user.BMI !== null) {
      updateData['BMI'] = this.BMICalculator(user.weight as number, convertHeight)
    }

    if (user.BMR !== null) {
      updateData['BMR'] = this.BMRCalculator(user.weight as number, height, user.age as number, gender)
    }
    if (user.TDEE !== null) {
      updateData['TDEE'] = this.TDEECalculator(
        user.weight as number,
        height,
        user.age as number,
        gender,
        user.activity_level as number
      )
    }
    if (user.IBW !== null) {
      updateData['IBW'] = this.IBWCalculator(height, gender)
    }
    if (user.LBM !== null) {
      updateData['LBM'] = this.LBMCalculator(user.weight as number, height, gender)
    }

    // cập nhật lại db
    const updatedUser = await UserModel.findByIdAndUpdate(user_id, updateData, { new: true })
    if (updatedUser) {
      return omit(updatedUser.toObject(), ['password', 'upgrade_request'])
    }
  }
  async saveIBWService({ height, gender, user_id, IBW }: SaveIBWReqBody) {
    // save vào db
    const convertHeight = convertCentimeterToMetter(height)
    const user = await UserModel.findByIdAndUpdate(user_id, { height, gender, IBW }, { new: true })

    // cập nhật lại những chỉ số cùng sử dụng các giá trị với IBW , nếu chỉ số đó mà bằng null tức là chưa tính toán thì sẽ không cập nhật chỉ số đó'

    const updateData: Record<string, any> = {}

    if (!user) {
      throw new ErrorWithStatus({
        message: AUTH_USER_MESSAGE.USER_NOT_FOUND,
        status: HTTP_STATUS.NOT_FOUND
      })
    }

    // nếu các chỉ số khác null thì cập nhật

    if (user.BMI !== null) {
      updateData['BMI'] = this.BMICalculator(user.weight as number, convertHeight)
    }

    if (user.BMR !== null) {
      updateData['BMR'] = this.BMRCalculator(user.weight as number, height, user.age as number, gender)
    }

    if (user.TDEE !== null) {
      updateData['TDEE'] = this.TDEECalculator(
        user.weight as number,
        height,
        user.age as number,
        gender,
        user.activity_level as number
      )
    }

    if (user.body_fat !== null) {
      updateData['body_fat'] = this.BodyFatCalculator(
        height,
        user.neck as number,
        user.waist as number,
        user.hip as number,
        gender
      )
    }

    if (user.LBM !== null) {
      updateData['LBM'] = this.LBMCalculator(user.weight as number, height, gender)
    }

    // cập nhật lại db
    const updatedUser = await UserModel.findByIdAndUpdate(user_id, updateData, { new: true })
    if (updatedUser) {
      return omit(updatedUser.toObject(), ['password', 'upgrade_request'])
    }
  }
  async saveLBMService({ weight, height, gender, LBM, user_id }: SaveLBMReqBody) {
    // save vào db
    const convertHeight = convertCentimeterToMetter(height)
    // const user = await UserModel.findByIdAndUpdate(user_id, { weight, height, gender, LBM }, { new: true })

    // tìm user theo id và so sánh weight cũ với weight mới nếu khác thì cập nhật lại weight và thêm weight mới vào pre_weight còn nếu giống nhau thì cập nhập lại date của weight cũ trong pre_weight
    const user = await UserModel.findOne({ _id: user_id })

    if (!user) {
      throw new ErrorWithStatus({
        message: AUTH_USER_MESSAGE.USER_NOT_FOUND,
        status: HTTP_STATUS.NOT_FOUND
      })
    }

    if (user.weight !== weight) {
      const pre_weight = user.pre_weight || []

      // nếu pre_weight > 10 thì xóa phần tử đầu tiên thêm phần tử mới vào cuối mảng

      if (pre_weight.length >= 10) {
        pre_weight.shift()
        pre_weight.push({ weight: weight, date: new Date() })
      } else {
        pre_weight.push({ weight: weight, date: new Date() })
      }

      await UserModel.findByIdAndUpdate(user_id, { weight, height, gender, LBM, pre_weight }, { new: true })
    } else {
      const pre_weight = user.pre_weight || []
      pre_weight[pre_weight.length - 1].date = new Date()
      await UserModel.findByIdAndUpdate(user_id, { weight, height, gender, LBM, pre_weight }, { new: true })
    }

    // cập nhật lại những chỉ số cùng sử dụng các giá trị với LBM , nếu chỉ số đó mà bằng null tức là chưa tính toán thì sẽ không cập nhật chỉ số đó'

    const updateData: Record<string, any> = {}

    // nếu các chỉ số khác null thì cập nhật

    if (user.BMI !== null) {
      updateData['BMI'] = this.BMICalculator(weight, convertHeight)
    }

    if (user.BMR !== null) {
      updateData['BMR'] = this.BMRCalculator(weight, height, user.age as number, gender)
    }

    if (user.TDEE !== null) {
      updateData['TDEE'] = this.TDEECalculator(
        weight,
        height,
        user.age as number,
        gender,
        user.activity_level as number
      )
    }
    if (user.body_fat !== null) {
      updateData['body_fat'] = this.BodyFatCalculator(
        height,
        user.neck as number,
        user.waist as number,
        user.hip as number,
        gender
      )
    }
    if (user.IBW !== null) {
      updateData['IBW'] = this.IBWCalculator(height, gender)
    }

    // cập nhật lại db

    const updatedUser = await UserModel.findByIdAndUpdate(user_id, updateData, { new: true })
    if (updatedUser) {
      return omit(updatedUser.toObject(), ['password', 'upgrade_request'])
    }
  }
}

const calculatorServices = new CalculatorServices()
export default calculatorServices
