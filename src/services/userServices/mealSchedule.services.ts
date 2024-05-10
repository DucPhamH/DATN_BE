import moment from 'moment'
import { ObjectId } from 'mongodb'
import { PurposeValue } from '~/constants/enums'
import HTTP_STATUS from '~/constants/httpStatus'
import { AUTH_USER_MESSAGE, MEAL_MESSAGE } from '~/constants/messages'
import {
  CreateMealItemsBody,
  CreateMealScheduleBody,
  UpdateMealScheduleBody
} from '~/models/requests/mealSchedule.request'
import MealItemModel from '~/models/schemas/mealItem.schema'
import MealScheduleModel from '~/models/schemas/mealSchedule.schema'
import UserModel from '~/models/schemas/user.schema'
import { ErrorWithStatus } from '~/utils/error'

class MealScheduleServices {
  async createMealScheduleService({
    user_id,
    name,
    weight_target,
    purpose,
    start_date,
    end_date
  }: CreateMealScheduleBody) {
    // tìm user theo user_id
    const user = await UserModel.findById(user_id)
    if (!user) {
      throw new ErrorWithStatus({
        message: AUTH_USER_MESSAGE.USER_NOT_FOUND,
        status: HTTP_STATUS.NOT_FOUND
      })
    }

    if (user.BMI === null || user.TDEE === null || user.weight === null) {
      throw new ErrorWithStatus({
        message: MEAL_MESSAGE.BMI_TDEE_NOT_FOUND,
        status: HTTP_STATUS.NOT_FOUND
      })
    }
    const newStartDate = moment.utc(start_date).startOf('day').toDate()
    const newEndDate = moment.utc(end_date).startOf('day').toDate()

    // nếu không truyền vào weight_target thì sẽ lấy weight hiện tại của user
    if (!weight_target) {
      weight_target = user.weight
    }
    // nếu pusrpose là 0 thì là tăng cân => weight_target phải lớn hơn weight hiện tại
    if (purpose === PurposeValue.gainWeight && user.weight && (weight_target ?? user.weight) <= user.weight) {
      throw new ErrorWithStatus({
        message: MEAL_MESSAGE.INVALID_WEIGHT_TARGET,
        status: HTTP_STATUS.BAD_REQUEST
      })
    }

    // nếu purpose là 1 thì là giảm cân => weight_target phải nhỏ hơn weight hiện tại
    if (purpose === PurposeValue.loseWeight && user.weight && (weight_target ?? user.weight) >= user.weight) {
      throw new ErrorWithStatus({
        message: MEAL_MESSAGE.INVALID_WEIGHT_TARGET,
        status: HTTP_STATUS.BAD_REQUEST
      })
    }

    const newSchedule = await MealScheduleModel.create({
      user_id,
      name,
      weight_target,
      purpose,
      start_date: newStartDate,
      end_date: newEndDate
    })
    return newSchedule
  }
  async updateMealScheduleService({ id, user_id, name, weight_target, purpose, end_date }: UpdateMealScheduleBody) {
    const user = await UserModel.findById(user_id)
    if (!user) {
      throw new ErrorWithStatus({
        message: AUTH_USER_MESSAGE.USER_NOT_FOUND,
        status: HTTP_STATUS.NOT_FOUND
      })
    }

    const newEndDate = moment.utc(end_date).startOf('day').toDate()

    // nếu không truyền vào weight_target thì sẽ lấy weight hiện tại của user
    if (!weight_target) {
      weight_target = user.weight
    }
    // nếu pusrpose là 0 thì là tăng cân => weight_target phải lớn hơn weight hiện tại
    if (purpose === PurposeValue.gainWeight && user.weight && (weight_target ?? user.weight) <= user.weight) {
      throw new ErrorWithStatus({
        message: MEAL_MESSAGE.INVALID_WEIGHT_TARGET,
        status: HTTP_STATUS.BAD_REQUEST
      })
    }

    // nếu purpose là 1 thì là giảm cân => weight_target phải nhỏ hơn weight hiện tại
    if (purpose === PurposeValue.loseWeight && user.weight && (weight_target ?? user.weight) >= user.weight) {
      throw new ErrorWithStatus({
        message: MEAL_MESSAGE.INVALID_WEIGHT_TARGET,
        status: HTTP_STATUS.BAD_REQUEST
      })
    }

    const mealSchedule = await MealScheduleModel.findByIdAndUpdate(
      { _id: new ObjectId(id), user_id: new ObjectId(user_id) },
      { name, weight_target, purpose, end_date: newEndDate },
      { new: true }
    ).exec()

    return mealSchedule
  }
  async getListMealScheduleService({ page, limit, user_id }: { page: number; limit: number; user_id: string }) {
    if (!page) page = 1
    if (!limit) limit = 10

    const mealSchedule = await MealScheduleModel.find({ user_id: new ObjectId(user_id) })
      .skip((page - 1) * limit)
      .limit(limit)
      .exec()

    const totalMealSchedule = await MealScheduleModel.countDocuments({ user_id: new ObjectId(user_id) })
    const totalPage = Math.ceil(totalMealSchedule / limit)
    return {
      mealSchedule,
      totalPage,
      page,
      limit
    }
  }
  async getMealScheduleByIdService({ id, user_id }: { id: string; user_id: string }) {
    const mealSchedule = await MealScheduleModel.findOne({
      _id: new ObjectId(id),
      user_id: new ObjectId(user_id)
    }).exec()

    return mealSchedule
  }
  async createMealScheduleItemService({ arrayMealItems }: CreateMealItemsBody) {
    const arrayMealItemWithDate = arrayMealItems.map((item) => {
      return { ...item, current_date: moment.utc(item.current_date).startOf('day').toDate() }
    })
    const mealItems = await MealItemModel.insertMany(arrayMealItemWithDate)
    return mealItems
  }
  async getListDateMealItemService({
    meal_schedule_id,
    page,
    limit
  }: {
    meal_schedule_id: string
    page: number
    limit: number
  }) {
    if (!page) page = 1
    if (!limit) limit = 10
    const mealDate = await MealItemModel.aggregate([
      {
        $match: {
          meal_schedule_id: new ObjectId(meal_schedule_id)
        }
      },
      // nhóm các item theo ngày tháng năm và bỏ qua giờ phút giây
      {
        $group: {
          _id: {
            year: { $year: '$current_date' },
            month: { $month: '$current_date' },
            day: { $dayOfMonth: '$current_date' }
          },
          // push các item vào mảng và tính tổng calo, tổng protein, tổng fat, tổng carb
          items: { $push: '$$ROOT' },
          total_calories: { $sum: '$energy' },
          total_protein: { $sum: '$protein' },
          total_fat: { $sum: '$fat' },
          total_carb: { $sum: '$carb' }
        }
      },
      // nếu tất cả các item trong mảng is_completed = true thì tạo trường is_completed = true còn không thì false
      {
        $project: {
          _id: 1,
          date: {
            $dateFromParts: {
              year: '$_id.year',
              month: '$_id.month',
              day: '$_id.day'
            }
          },
          items: 1,
          total_calories: 1,
          total_protein: 1,
          total_fat: 1,
          total_carb: 1,
          is_completed: {
            $cond: {
              if: {
                $eq: [
                  {
                    $size: { $filter: { input: '$items', as: 'item', cond: { $eq: ['$$item.is_completed', false] } } }
                  },
                  0
                ]
              },
              then: true,
              else: false
            }
          }
        }
      },
      // lấy total calo , protein, fat, carb sau 1 chữ số thập phân
      {
        $addFields: {
          total_calories: {
            $round: ['$total_calories', 1]
          },
          total_protein: {
            $round: ['$total_protein', 1]
          },
          total_fat: {
            $round: ['$total_fat', 1]
          },
          total_carb: {
            $round: ['$total_carb', 1]
          }
        }
      },
      {
        $sort: { date: 1 }
      },
      {
        $skip: (page - 1) * limit
      },
      {
        $limit: limit
      }
    ])

    const totalMealDate = await MealItemModel.aggregate([
      {
        $match: {
          meal_schedule_id: new ObjectId(meal_schedule_id)
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$current_date' },
            month: { $month: '$current_date' },
            day: { $dayOfMonth: '$current_date' }
          }
        }
      }
    ])

    const totalPage = Math.ceil(totalMealDate.length / limit)
    return {
      mealDate,
      totalPage,
      page,
      limit
    }
  }
  async compeleteDateMealItemService({ meal_schedule_id, date }: { meal_schedule_id: string; date: string }) {
    // so sánh ngày tháng năm của current_date với ngày tháng năm của date truyền vào bỏ qua giờ phút giây
    console.log(date)
    // tăng date lên 1 ngày
    const nextDate = moment.utc(new Date(date)).add(1, 'days').toDate()
    console.log(nextDate)
    const newDate = new Date(date)
    console.log(newDate)

    // tìm tất cả những item có is_completed = false và thuộc ngày date
    // // cập nhật lại total_calo , total_protein, total_fat, total_carb của meal_schedule bằng tổng calo, protein, fat, carb của các item có is_completed = true và thuộc ngày date
    const total = await MealItemModel.aggregate([
      {
        $match: {
          meal_schedule_id: new ObjectId(meal_schedule_id),
          current_date: {
            $gte: newDate,
            $lt: nextDate
          },
          is_completed: false
        }
      },
      {
        $group: {
          _id: null,
          total_calories: { $sum: '$energy' },
          total_protein: { $sum: '$protein' },
          total_fat: { $sum: '$fat' },
          total_carb: { $sum: '$carb' }
        }
      }
    ])
    console.log(total)
    // cộng total calo, protein, fat, carb vào total_calo, total_protein, total_fat, total_carb của meal_schedule

    const mealSchedule = await MealScheduleModel.findById(meal_schedule_id)

    if (mealSchedule) {
      const total_calo = (mealSchedule.total_calo + total[0].total_calories).toFixed(1)
      const total_protein = (mealSchedule.total_protein + total[0].total_protein).toFixed(1)
      const total_fat = (mealSchedule.total_fat + total[0].total_fat).toFixed(1)
      const total_carb = (mealSchedule.total_carb + total[0].total_carb).toFixed(1)

      await MealScheduleModel.updateOne(
        {
          _id: new ObjectId(meal_schedule_id)
        },
        {
          $set: {
            total_calo,
            total_protein,
            total_fat,
            total_carb
          }
        }
      )
    }
    const mealItems = await MealItemModel.updateMany(
      {
        meal_schedule_id: new ObjectId(meal_schedule_id),
        current_date: {
          $gte: newDate,
          $lt: nextDate
        }
      },
      {
        $set: {
          is_completed: true
        }
      }
    )
    console.log(mealItems)

    return true
  }
  async getDateMealItemService({ meal_schedule_id, date }: { meal_schedule_id: string; date: string }) {
    // so sánh ngày tháng năm của current_date với ngày tháng năm của date truyền vào bỏ qua giờ phút giây
    console.log(date)
    // tăng date lên 1 ngày
    const nextDate = moment.utc(new Date(date)).add(1, 'days').toDate()
    console.log(nextDate)
    const newDate = new Date(date)
    console.log(newDate)

    // tìm các item có complete bằng true
    const mealItems = await MealItemModel.aggregate([
      {
        $match: {
          meal_schedule_id: new ObjectId(meal_schedule_id),
          current_date: {
            $gte: newDate,
            $lt: nextDate
          },
          is_completed: true
        }
      },
      {
        $group: {
          _id: null,
          total_calories: { $sum: '$energy' },
          total_protein: { $sum: '$protein' },
          total_fat: { $sum: '$fat' },
          total_carb: { $sum: '$carb' },
          items: { $push: '$$ROOT' }
        }
      }
    ])
    return mealItems
  }
  async deleteDateMealItemService({
    meal_schedule_id,
    date,
    is_completed
  }: {
    meal_schedule_id: string
    date: string
    is_completed: string
  }) {
    const nextDate = moment.utc(new Date(date)).add(1, 'days').toDate()
    const newDate = new Date(date)
    console.log(is_completed)
    if (is_completed === 'false') {
      const mealItems = await MealItemModel.deleteMany({
        meal_schedule_id: new ObjectId(meal_schedule_id),
        current_date: {
          $gte: newDate,
          $lt: nextDate
        }
      })

      return true
    }

    // tìm total calo, protein, fat, carb của ngày cần xóa
    const total = await MealItemModel.aggregate([
      {
        $match: {
          meal_schedule_id: new ObjectId(meal_schedule_id),
          current_date: {
            $gte: newDate,
            $lt: nextDate
          },
          is_completed: true
        }
      },
      {
        $group: {
          _id: null,
          total_calories: { $sum: '$energy' },
          total_protein: { $sum: '$protein' },
          total_fat: { $sum: '$fat' },
          total_carb: { $sum: '$carb' }
        }
      }
    ])

    // cập nhật lại total_calo, total_protein, total_fat, total_carb của meal_schedule bằng tổng calo, protein, fat, carb của các item có is_completed = true và thuộc ngày date

    const mealSchedule = await MealScheduleModel.findById(meal_schedule_id)

    if (mealSchedule) {
      const total_calo = ((mealSchedule.total_calo ?? 0) - total[0].total_calories).toFixed(1)
      const total_protein = ((mealSchedule.total_protein ?? 0) - total[0].total_protein).toFixed(1)
      const total_fat = ((mealSchedule.total_fat ?? 0) - total[0].total_fat).toFixed(1)
      const total_carb = ((mealSchedule.total_carb ?? 0) - total[0].total_carb).toFixed(1)

      await MealScheduleModel.updateOne(
        {
          _id: new ObjectId(meal_schedule_id)
        },
        {
          $set: {
            total_calo,
            total_protein,
            total_fat,
            total_carb
          }
        }
      )
    }

    // xóa các item có current_date = date
    const mealItems = await MealItemModel.deleteMany({
      meal_schedule_id: new ObjectId(meal_schedule_id),
      current_date: {
        $gte: newDate,
        $lt: nextDate
      }
    })

    return true
  }
  async deleteMealScheduleService({ id, user_id }: { id: string; user_id: string }) {
    // xóa hết item của meal_item
    await MealItemModel.deleteMany({ meal_schedule_id: new ObjectId(id) })

    // xóa meal_schedule
    await MealScheduleModel.findByIdAndDelete({ _id: new ObjectId(id), user_id: new ObjectId(user_id) })
    return true
  }
}

const mealScheduleServices = new MealScheduleServices()
export default mealScheduleServices
