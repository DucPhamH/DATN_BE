export interface UpdateUserBody {
  user_id: string
  name?: string
  user_name?: string
  birthday?: Date
  address?: string
}

export interface RequestUserBody {
  user_id: string
  reason?: string
  proof?: string
}
