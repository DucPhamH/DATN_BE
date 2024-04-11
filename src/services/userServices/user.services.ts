import { ObjectId } from 'mongodb'
import { UserStatus } from '~/constants/enums'
import FollowModel from '~/models/schemas/follow.schema'
import UserModel from '~/models/schemas/user.schema'

class UsersService {
  async followUserService(user_id: string, follow_id: string) {
    const newFollow = FollowModel.findOneAndUpdate(
      { user_id, follow_id },
      { user_id, follow_id },
      { upsert: true, new: true }
    )
    return newFollow
  }
  async unfollowUserService(user_id: string, follow_id: string) {
    const unfollow = FollowModel.findOneAndDelete({ user_id, follow_id })
    return unfollow
  }
  async getMe({ user_id }: { user_id: string }) {
    const me = await UserModel.aggregate([
      { $match: { _id: new ObjectId(user_id), status: UserStatus.active } },
      // lấy những người follow mình
      {
        $lookup: {
          from: 'follows',
          localField: '_id',
          foreignField: 'follow_id',
          as: 'followers'
        }
      },
      // nối followers vào bảng user để lấy thông tin những người follow mình
      {
        $lookup: {
          from: 'users',
          localField: 'followers.user_id',
          foreignField: '_id',
          as: 'followers'
        }
      },
      // lọc ra những người bị banned trong mảng followers dùng addfields
      {
        $addFields: {
          followers: {
            $filter: {
              input: '$followers',
              as: 'follower',
              cond: { $eq: ['$$follower.status', UserStatus.active] }
            }
          }
        }
      },
      // đếm số người follow mình
      {
        $addFields: {
          followers_count: { $size: '$followers' }
        }
      },
      // xóa password trong mảng followers
      {
        $addFields: {
          followers: {
            $map: {
              input: '$followers',
              as: 'follower',
              in: {
                _id: '$$follower._id',
                email: '$$follower.email',
                name: '$$follower.name',
                avatar: '$$follower.avatar'
              }
            }
          }
        }
      }
    ])
    return me
  }
  async getUserById({ id, user_id }: { id: string; user_id: string }) {
    const user = await UserModel.aggregate([
      {
        $match: { _id: new ObjectId(id), status: UserStatus.active }
      },
      // lấy những người follow mình
      {
        $lookup: {
          from: 'follows',
          localField: '_id',
          foreignField: 'follow_id',
          as: 'followers'
        }
      },
      // nối followers vào bảng user để lấy thông tin những người follow mình
      {
        $lookup: {
          from: 'users',
          localField: 'followers.user_id',
          foreignField: '_id',
          as: 'followers'
        }
      },
      // lọc ra những người bị banned trong mảng followers
      {
        $addFields: {
          followers: {
            $filter: {
              input: '$followers',
              as: 'follower',
              cond: { $eq: ['$$follower.status', UserStatus.active] }
            }
          }
        }
      },
      // kiểm tra xem user_id có trong mảng followers không
      {
        $addFields: {
          is_following: {
            $in: [new ObjectId(user_id), '$followers._id']
          }
        }
      },
      // đếm số người follow mình
      {
        $addFields: {
          followers_count: { $size: '$followers' }
        }
      },
      // xóa password trong mảng followers
      {
        $addFields: {
          followers: {
            $map: {
              input: '$followers',
              as: 'follower',
              in: {
                _id: '$$follower._id',
                email: '$$follower.email',
                name: '$$follower.name',
                avatar: '$$follower.avatar'
              }
            }
          }
        }
      }
    ])
    return user
  }
  async recommendUsersService(user_id: string) {
    // lấy ra 5 người ngẫu nhiên mà user_id chưa follow
    const recommendUsers = await UserModel.aggregate([
      {
        $match: { _id: { $ne: new ObjectId(user_id), status: UserStatus.active } }
      },
      // kiếm ngẫu nhiên 5 người mà user_id chưa follow
      { $sample: { size: 5 } }
    ])
  }
}

const usersService = new UsersService()
export default usersService
