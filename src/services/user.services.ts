import UserModel, { User } from '~/models/schemas/user.schema'

class UsersService {
  async createUser(user: User) {
    const newUser = await UserModel.create(user)
    return newUser
  }
  async getUsers() {
    const users = await UserModel.find()
    return users
  }
}

const usersService = new UsersService()
export default usersService
