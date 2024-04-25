export interface CreateWorkoutScheduleBody {
  user_id: string
  name: string
  weight: number
  calo_target: number
  start_date: Date
  end_date: Date
}
