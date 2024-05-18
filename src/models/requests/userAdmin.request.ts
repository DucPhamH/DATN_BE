import { UserRoles } from '~/constants/enums'

export interface GetListUserAdminQuery {
  page?: number
  limit?: number
  role?: number
  status?: number
  search?: string
  sort?: string
}

export interface CreateUserAdminBody {
  name: string
  email: string
  user_name: string
  role: UserRoles
}
