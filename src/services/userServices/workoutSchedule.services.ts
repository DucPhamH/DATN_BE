import { ObjectId } from 'mongodb'
import { CreateWorkoutScheduleBody } from '~/models/requests/workoutSchedule.request'
import WorkoutScheduleModel from '~/models/schemas/workoutSchedule.schema'

class WorkoutScheduleService {
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
      .limit(limit)
      .skip((page - 1) * limit)
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
}

const workoutScheduleService = new WorkoutScheduleService()
export default workoutScheduleService
