import moment from 'moment'
import { ObjectId } from 'mongodb'
import { CreateWorkoutItemsBody, CreateWorkoutScheduleBody } from '~/models/requests/workoutSchedule.request'
import WorkoutItemModel from '~/models/schemas/workoutItem.schemas'
import WorkoutScheduleModel from '~/models/schemas/workoutSchedule.schema'

class WorkoutScheduleService {
  private CalorieBurnedCalculator(weight: number, time: number, met: number) {
    // (MET x 3.5 x cân nặng(kg)) / 200 x thời gian tập luyện (phút) = lượng calo tiêu hao
    const caloriePerMinutes = (met * 3.5 * weight) / 200
    return parseFloat((caloriePerMinutes * time).toFixed(1))
  }
  async createWorkoutScheduleService({
    user_id,
    name,
    weight,
    calo_target,
    start_date,
    end_date
  }: CreateWorkoutScheduleBody) {
    const workoutSchedule = await WorkoutScheduleModel.create({
      user_id: new ObjectId(user_id),
      name,
      weight,
      calo_target,
      start_date,
      end_date
    })

    return workoutSchedule
  }
  async getListWorkoutScheduleService({ page, limit, user_id }: { page: number; limit: number; user_id: string }) {
    if (!page) page = 1
    if (!limit) limit = 10
    const workoutSchedule = await WorkoutScheduleModel.find({ user_id: new ObjectId(user_id) })
      .skip((page - 1) * limit)
      .limit(limit)
      .exec()

    const totalWorkoutSchedule = await WorkoutScheduleModel.countDocuments({ user_id: new ObjectId(user_id) })
    const totalPage = Math.ceil(totalWorkoutSchedule / limit)
    return {
      workoutSchedule,
      totalPage,
      page,
      limit
    }
  }
  async getWorkoutScheduleByIdService({ id, user_id }: { id: string; user_id: string }) {
    const workoutSchedule = await WorkoutScheduleModel.findOne({
      _id: new ObjectId(id),
      user_id: new ObjectId(user_id)
    }).exec()

    return workoutSchedule
  }

  async createWorkoutItemService({ arrayWorkoutItems }: CreateWorkoutItemsBody) {
    //tìm workout_schedule theo id
    const workoutSchedule = await WorkoutScheduleModel.findById(arrayWorkoutItems[0].workout_schedule_id)

    if (workoutSchedule) {
      // tính calo tiêu hao trong từng item và lưu vào db
      const arrayWorkoutItemsWithCaloBurn = arrayWorkoutItems.map((item) => {
        const calo_burn = this.CalorieBurnedCalculator(workoutSchedule.weight, item.time, item.met)
        return { ...item, calo_burn }
      })
      console.log(arrayWorkoutItemsWithCaloBurn)

      const workoutItems = await WorkoutItemModel.insertMany(arrayWorkoutItemsWithCaloBurn)

      return workoutItems
    }
  }

  async getListDateWorkoutItemService({
    workout_schedule_id,
    page,
    limit
  }: {
    workout_schedule_id: string
    page: number
    limit: number
  }) {
    console.log(page)
    if (!page) page = 1
    if (!limit) limit = 10
    const workoutDate = await WorkoutItemModel.aggregate([
      {
        $match: {
          workout_schedule_id: new ObjectId(workout_schedule_id)
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
          // push các item vào mảng
          items: { $push: '$$ROOT' },
          total_calories: { $sum: '$calo_burn' }
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
      // lấy total calo sau 1 chữ số thập phân
      {
        $addFields: {
          total_calories: {
            $round: ['$total_calories', 1]
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

    const totalWorkoutDate = await WorkoutItemModel.aggregate([
      {
        $match: {
          workout_schedule_id: new ObjectId(workout_schedule_id)
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

    const totalPage = Math.ceil(totalWorkoutDate.length / limit)
    return {
      workoutDate,
      totalPage,
      page,
      limit
    }
  }

  async completeDateWorkoutItemService({ workout_schedule_id, date }: { workout_schedule_id: string; date: string }) {
    // so sánh ngày tháng năm của current_date với ngày tháng năm của date truyền vào bỏ qua giờ phút giây
    console.log(date)
    // tăng date lên 1 ngày
    const nextDate = moment.utc(new Date(date)).add(1, 'days').toDate()
    console.log(nextDate)
    const newDate = new Date(date)
    console.log(newDate)

    // tìm tất cả những item có is_completed = false và thuộc ngày date

    // // cập nhật lại total_calories_burn của workout_schedule bằng tổng calo của các item có is_completed = true và thuộc ngày date
    const total_calories_burn = await WorkoutItemModel.aggregate([
      {
        $match: {
          workout_schedule_id: new ObjectId(workout_schedule_id),
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
          total_calories: { $sum: '$calo_burn' }
        }
      }
    ])
    console.log(total_calories_burn)

    // cộng total_calories_burn vào total_calo_burn của workout_schedule

    const workoutSchedule = await WorkoutScheduleModel.findById(workout_schedule_id)

    if (workoutSchedule) {
      const total_calo_burn = (workoutSchedule.total_calo_burn + total_calories_burn[0].total_calories).toFixed(1)
      console.log(total_calo_burn)
      await WorkoutScheduleModel.updateOne(
        {
          _id: new ObjectId(workout_schedule_id)
        },
        {
          $set: {
            total_calo_burn
          }
        }
      )
    }

    const workoutItems = await WorkoutItemModel.updateMany(
      {
        workout_schedule_id: new ObjectId(workout_schedule_id),
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
    console.log(workoutItems)

    return true
  }

  async deleteDateWorkoutItemService({
    workout_schedule_id,
    date,
    is_completed
  }: {
    workout_schedule_id: string
    date: string
    is_completed: string
  }) {
    const nextDate = moment.utc(new Date(date)).add(1, 'days').toDate()
    const newDate = new Date(date)
    console.log(is_completed)
    if (is_completed === 'false') {
      const workoutItems = await WorkoutItemModel.deleteMany({
        workout_schedule_id: new ObjectId(workout_schedule_id),
        current_date: {
          $gte: newDate,
          $lt: nextDate
        }
      })

      return true
    }

    // tìm total_calo_burn của ngày cần xóa
    const total_calories_burn = await WorkoutItemModel.aggregate([
      {
        $match: {
          workout_schedule_id: new ObjectId(workout_schedule_id),
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
          total_calories: { $sum: '$calo_burn' }
        }
      }
    ])

    // cập nhật lại total_calo_burn của workout_schedule bằng tổng calo của các item có is_completed = true và thuộc ngày date

    const workoutSchedule = await WorkoutScheduleModel.findById(workout_schedule_id)

    if (workoutSchedule) {
      const total_calo_burn = ((workoutSchedule.total_calo_burn ?? 0) - total_calories_burn[0].total_calories).toFixed(
        1
      )
      console.log(total_calo_burn)
      await WorkoutScheduleModel.updateOne(
        {
          _id: new ObjectId(workout_schedule_id)
        },
        {
          $set: {
            total_calo_burn
          }
        }
      )
    }

    // xóa các item có current_date = date
    const workoutItems = await WorkoutItemModel.deleteMany({
      workout_schedule_id: new ObjectId(workout_schedule_id),
      current_date: {
        $gte: newDate,
        $lt: nextDate
      }
    })

    return true
  }
}

const workoutScheduleService = new WorkoutScheduleService()
export default workoutScheduleService
