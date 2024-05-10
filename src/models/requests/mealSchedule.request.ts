export interface CreateMealScheduleBody {
  user_id: string
  name: string
  weight_target?: number
  purpose: number
  start_date: Date
  end_date: Date
}

export interface UpdateMealScheduleBody {
  user_id: string
  id: string
  name: string
  weight_target?: number
  purpose: number
  end_date: Date
}

export interface CreateMealItemsBody {
  arrayMealItems: {
    meal_schedule_id: string
    meal_name: string
    quantity: number
    unit: string
    energy: number
    protein: number
    fat: number
    carb: number
    current_date: Date
  }[]
}
