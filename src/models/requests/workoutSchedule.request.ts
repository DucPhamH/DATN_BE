export interface CreateWorkoutScheduleBody {
  user_id: string
  name: string
  weight: number
  calo_target: number
  start_date: Date
  end_date: Date
}

export interface UpdateWorkoutScheduleBody {
  id: string
  user_id: string
  name: string
  calo_target: number
  end_date: Date
}

export interface CreateWorkoutItemsBody {
  arrayWorkoutItems: {
    workout_schedule_id: string
    activity_name: string
    time: number
    met: number
    current_date: Date
  }[]
}
