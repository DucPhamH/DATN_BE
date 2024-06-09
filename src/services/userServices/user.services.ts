import { omit } from 'lodash'
import moment from 'moment'
import { ObjectId } from 'mongodb'
import sharp from 'sharp'
import {
  AlbumStatus,
  BlogStatus,
  NotificationTypes,
  RecipeStatus,
  RequestType,
  UserRoles,
  UserStatus
} from '~/constants/enums'
import HTTP_STATUS from '~/constants/httpStatus'
import { USER_MESSAGE } from '~/constants/messages'
import { RequestUserBody, UpdateUserBody } from '~/models/requests/user.request'
import AlbumModel from '~/models/schemas/album.schema'
import BookmarkAlbumModel from '~/models/schemas/bookmarkAlbum.schema'
import BookmarkRecipeModel from '~/models/schemas/bookmarkRecipe.schema'
import FollowModel from '~/models/schemas/follow.schema'
import NotificationModel from '~/models/schemas/notification.schema'
import RecipeModel from '~/models/schemas/recipe.schema'
import fs from 'fs'
import UserModel from '~/models/schemas/user.schema'
import { comparePassword, hashPassword } from '~/utils/crypto'

import { ErrorWithStatus } from '~/utils/error'
import { deleteFileFromS3, uploadFileToS3 } from '~/utils/s3'

class UsersService {
  async followUserService({ user_id, follow_id }: { user_id: string; follow_id: string }) {
    const newFollow = FollowModel.findOneAndUpdate(
      { user_id, follow_id },
      { user_id, follow_id },
      { upsert: true, new: true }
    )

    if (user_id !== follow_id) {
      await NotificationModel.findOneAndUpdate(
        {
          sender_id: new ObjectId(user_id),
          receiver_id: new ObjectId(follow_id),
          link_id: user_id,
          type: NotificationTypes.follow
        },
        {
          sender_id: new ObjectId(user_id),
          receiver_id: new ObjectId(follow_id),
          link_id: user_id,
          content: 'Đã theo dõi bạn',
          type: NotificationTypes.follow
        },
        { upsert: true }
      )
    }
    return newFollow
  }
  async unfollowUserService({ user_id, follow_id }: { user_id: string; follow_id: string }) {
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
      },

      // nối với bảng posts để lấy số bài viết
      {
        $lookup: {
          from: 'posts',
          localField: '_id',
          foreignField: 'user_id',
          as: 'posts'
        }
      },
      // đếm số bài viết
      {
        $addFields: {
          posts_count: { $size: '$posts' }
        }
      },

      // nối với bảng albums để lấy số album
      {
        $lookup: {
          from: 'albums',
          localField: '_id',
          foreignField: 'user_id',
          as: 'albums'
        }
      },
      // lấy những album có status là accepted
      {
        $addFields: {
          albums: {
            $filter: {
              input: '$albums',
              as: 'album',
              cond: { $eq: ['$$album.status', AlbumStatus.accepted] }
            }
          }
        }
      },
      // đếm số album
      {
        $addFields: {
          albums_count: { $size: '$albums' }
        }
      },
      // nối với bảng recipes để lấy số công thức
      {
        $lookup: {
          from: 'recipes',
          localField: '_id',
          foreignField: 'user_id',
          as: 'recipes'
        }
      },
      {
        $addFields: {
          recipes: {
            $filter: {
              input: '$recipes',
              as: 'recipe',
              cond: { $eq: ['$$recipe.status', RecipeStatus.accepted] }
            }
          }
        }
      },
      // đếm số công thức
      {
        $addFields: {
          recipes_count: { $size: '$recipes' }
        }
      },
      // nối với bảng blogs để lấy số blog
      {
        $lookup: {
          from: 'blogs',
          localField: '_id',
          foreignField: 'user_id',
          as: 'blogs'
        }
      },
      {
        $addFields: {
          blogs: {
            $filter: {
              input: '$blogs',
              as: 'blog',
              cond: { $eq: ['$$blog.status', BlogStatus.accepted] }
            }
          }
        }
      },
      // đếm số blog
      {
        $addFields: {
          blogs_count: { $size: '$blogs' }
        }
      },
      // bỏ password
      {
        $project: {
          password: 0
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
      },
      // nối với bảng posts để lấy số bài viết
      {
        $lookup: {
          from: 'posts',
          localField: '_id',
          foreignField: 'user_id',
          as: 'posts'
        }
      },
      // đếm số bài viết
      {
        $addFields: {
          posts_count: { $size: '$posts' }
        }
      },
      // nối với bảng albums để lấy số album
      {
        $lookup: {
          from: 'albums',
          localField: '_id',
          foreignField: 'user_id',
          as: 'albums'
        }
      },
      // lấy những album có status là accepted
      {
        $addFields: {
          albums: {
            $filter: {
              input: '$albums',
              as: 'album',
              cond: { $eq: ['$$album.status', AlbumStatus.accepted] }
            }
          }
        }
      },
      // đếm số album
      {
        $addFields: {
          albums_count: { $size: '$albums' }
        }
      },
      // nối với bảng recipes để lấy số công thức
      {
        $lookup: {
          from: 'recipes',
          localField: '_id',
          foreignField: 'user_id',
          as: 'recipes'
        }
      },
      {
        $addFields: {
          recipes: {
            $filter: {
              input: '$recipes',
              as: 'recipe',
              cond: { $eq: ['$$recipe.status', RecipeStatus.accepted] }
            }
          }
        }
      },
      // đếm số công thức
      {
        $addFields: {
          recipes_count: { $size: '$recipes' }
        }
      },
      // nối với bảng blogs để lấy số blog
      {
        $lookup: {
          from: 'blogs',
          localField: '_id',
          foreignField: 'user_id',
          as: 'blogs'
        }
      },
      {
        $addFields: {
          blogs: {
            $filter: {
              input: '$blogs',
              as: 'blog',
              cond: { $eq: ['$$blog.status', BlogStatus.accepted] }
            }
          }
        }
      },
      // đếm số blog
      {
        $addFields: {
          blogs_count: { $size: '$blogs' }
        }
      },
      // bỏ password
      {
        $project: {
          password: 0
        }
      }
    ])
    return user
  }
  async recommendUsersService({ user_id }: { user_id: string }) {
    // lấy ra 5 người ngẫu nhiên mà user_id chưa follow
    const recommendUsers = await UserModel.aggregate([
      {
        $match: {
          _id: { $ne: new ObjectId(user_id) },
          status: UserStatus.active,
          role: { $nin: [UserRoles.admin, UserRoles.inspector, UserRoles.writter] }
        }
      },
      {
        $lookup: {
          from: 'follows',
          localField: '_id',
          foreignField: 'follow_id',
          as: 'follows'
        }
      },
      {
        $addFields: {
          is_following: {
            $in: [new ObjectId(user_id), '$follows.user_id']
          }
        }
      },
      {
        $match: { is_following: false }
      },
      // kiếm ngẫu nhiên 5 người mà user_id chưa follow
      { $sample: { size: 5 } }
    ])
    return recommendUsers
  }
  async updateAvatarUserService({ user_id, image }: { user_id: string; image: any }) {
    // const newImage = {
    //   ...image,
    //   originalname: image?.originalname.split('.')[0] + new Date().getTime() + '.' + image?.originalname.split('.')[1],
    //   buffer: await sharp(image?.buffer as Buffer)
    //     .jpeg()
    //     .toBuffer()
    // }
    // const uploadRes = await uploadFileToS3({
    //   filename: `avatar/${newImage?.originalname}` as string,
    //   contentType: newImage?.mimetype as string,
    //   body: newImage?.buffer as Buffer
    // })
    console.log('new', image)

    const findUser = await UserModel.findOne({ _id: new ObjectId(user_id) })

    if (!findUser) {
      throw new ErrorWithStatus({
        message: USER_MESSAGE.USER_NOT_FOUND,
        status: HTTP_STATUS.NOT_FOUND
      })
    }

    // xóa ảnh cũ trên s3
    // lấy tên ảnh
    const old_image_name = findUser.avatar ? findUser.avatar.split('/')[findUser.avatar.split('/').length - 1] : ''
    console.log(old_image_name)

    // nếu tên ảnh có trong ./uploads/avatar thì xóa
    if (fs.existsSync(`./src/uploads/avatar/${old_image_name}`)) {
      fs.unlinkSync(`./src/uploads/avatar/${old_image_name}`)
    }

    // await deleteFileFromS3(`avatar/${old_image_name}`)

    //     url: 'https://bepvang.org.vn/Userfiles/Upload/images/Download/2017/2/24/268f41e9fdcd49999f327632ed207db1.jpg',

    const user = await UserModel.findOneAndUpdate(
      { _id: new ObjectId(user_id) },
      {
        avatar: `https://cookhealthydatn.io.vn/uploads/avatar/${image?.filename}`
      },
      { new: true }
    )

    if (user) {
      return omit(user.toObject(), ['password'])
    }
  }
  async updateCoverAvatarUserService({ user_id, image }: { user_id: string; image: any }) {
    const newImage = {
      ...image,
      originalname: image?.originalname.split('.')[0] + new Date().getTime() + '.' + image?.originalname.split('.')[1],
      buffer: await sharp(image?.buffer as Buffer)
        .jpeg()
        .toBuffer()
    }
    // const uploadRes = await uploadFileToS3({
    //   filename: `coverAvatar/${newImage?.originalname}` as string,
    //   contentType: newImage?.mimetype as string,
    //   body: newImage?.buffer as Buffer
    // })
    console.log(newImage)

    const findUser = await UserModel.findOne({ _id: new ObjectId(user_id) })

    if (!findUser) {
      throw new ErrorWithStatus({
        message: USER_MESSAGE.USER_NOT_FOUND,
        status: HTTP_STATUS.NOT_FOUND
      })
    }

    // xóa ảnh cũ trên s3
    // lấy tên ảnh
    // const old_image_name = findUser.avatar ? findUser.avatar.split('/')[findUser.avatar.split('/').length - 1] : ''
    // console.log(old_image_name)

    // await deleteFileFromS3(`coverAvatar/${old_image_name}`)

    //     url: 'https://bepvang.org.vn/Userfiles/Upload/images/Download/2017/2/24/268f41e9fdcd49999f327632ed207db1.jpg',

    const user = await UserModel.findOneAndUpdate(
      { _id: new ObjectId(user_id) },
      {
        cover_avatar:
          'https://bepvang.org.vn/Userfiles/Upload/images/Download/2017/2/24/268f41e9fdcd49999f327632ed207db1.jpg'
      },
      { new: true }
    )

    if (user) {
      return omit(user.toObject(), ['password'])
    }
  }
  async updateUserService({ user_id, name, user_name, birthday, address }: UpdateUserBody) {
    // check xem db có tồn tại user_name không, có thì không cho update
    const newBirthday = moment.utc(birthday).startOf('day').toDate()

    const objectData = {} as UpdateUserBody

    if (name) {
      objectData['name'] = name
    }
    if (user_name) {
      objectData['user_name'] = user_name
    }
    if (birthday) {
      objectData['birthday'] = newBirthday
    }
    if (address) {
      objectData['address'] = address
    }

    console.log(objectData)
    const user = await UserModel.findOneAndUpdate({ _id: new ObjectId(user_id) }, objectData, { new: true })

    if (user) {
      return omit(user.toObject(), ['password'])
    }
  }
  async changePasswordService({
    user_id,
    old_password,
    new_password
  }: {
    user_id: string
    old_password: string
    new_password: string
  }) {
    const user = await UserModel.findOne({ _id: new ObjectId(user_id) })

    if (!user) {
      throw new ErrorWithStatus({
        message: USER_MESSAGE.USER_NOT_FOUND,
        status: HTTP_STATUS.NOT_FOUND
      })
    }
    const compare = await comparePassword(old_password, user.password)
    if (!compare) {
      throw new ErrorWithStatus({
        message: USER_MESSAGE.OLD_PASSWORD_INCORRECT,
        status: HTTP_STATUS.BAD_REQUEST
      })
    }
    const hashedPassword = await hashPassword(new_password)
    const newUser = await UserModel.findOneAndUpdate(
      { _id: new ObjectId(user_id) },
      { password: hashedPassword },
      { new: true }
    )
    if (newUser) {
      return omit(newUser.toObject(), ['password'])
    }
  }
  async getBookmarkedUserService({ user_id }: { user_id: string }) {
    const idsInBookMarkRecipe = await BookmarkRecipeModel.find({ user_id: new ObjectId(user_id) }).select('recipe_id')
    const arrayIdInBookMarkRecipe = idsInBookMarkRecipe.map((item) => item.recipe_id)
    console.log(arrayIdInBookMarkRecipe)
    const idsInBookMarkAlbum = await BookmarkAlbumModel.find({ user_id: new ObjectId(user_id) }).select('album_id')
    const arrayIdInBookMarkAlbum = idsInBookMarkAlbum.map((item) => item.album_id)
    console.log(arrayIdInBookMarkAlbum)

    const recipes = await RecipeModel.aggregate([
      {
        $match: { _id: { $in: arrayIdInBookMarkRecipe }, status: RecipeStatus.accepted }
      },
      {
        $lookup: {
          from: 'recipe_categories',
          localField: 'category_recipe_id',
          foreignField: '_id',
          as: 'category_recipe'
        }
      },
      {
        $unwind: '$category_recipe'
      },
      {
        $lookup: {
          from: 'users',
          localField: 'user_id',
          foreignField: '_id',
          as: 'user'
        }
      },
      {
        $unwind: '$user'
      },
      // // loại bỏ password của user
      {
        $project: {
          'user.password': 0
        }
      },
      // // lookup tới bảng bookmark
      {
        $lookup: {
          from: 'bookmark_recipes',
          localField: '_id',
          foreignField: 'recipe_id',
          as: 'bookmarks'
        }
      },
      // // // check xem user_id đã bookmark recipe_id chưa
      {
        $addFields: {
          is_bookmarked: {
            $in: [new ObjectId(user_id), '$bookmarks.user_id']
          }
        }
      },
      // // đếm số lượt bookmark
      {
        $addFields: {
          total_bookmarks: { $size: '$bookmarks' }
        }
      },
      // // nối bảng like
      {
        $lookup: {
          from: 'like_recipes',
          localField: '_id',
          foreignField: 'recipe_id',
          as: 'likes'
        }
      },
      // // check xem user_id đã like recipe_id chưa
      {
        $addFields: {
          is_liked: {
            $in: [new ObjectId(user_id), '$likes.user_id']
          }
        }
      },
      // // đếm số lượt like
      {
        $addFields: {
          total_likes: { $size: '$likes' }
        }
      },
      // // nối bảng comment
      {
        $lookup: {
          from: 'comment_recipes',
          localField: '_id',
          foreignField: 'recipe_id',
          as: 'comments'
        }
      },
      // // đếm số lượt comment
      {
        $addFields: {
          total_comments: { $size: '$comments' }
        }
      },
      {
        $sort: { createdAt: -1 }
      }
    ])

    const albums = await AlbumModel.aggregate([
      {
        $match: { _id: { $in: arrayIdInBookMarkAlbum }, status: AlbumStatus.accepted }
      },
      {
        $lookup: {
          from: 'recipes',
          localField: '_id',
          foreignField: 'album_id',
          as: 'recipes'
        }
      },
      // look up tới bảng bookmark
      {
        $lookup: {
          from: 'bookmark_albums',
          localField: '_id',
          foreignField: 'album_id',
          as: 'bookmarks'
        }
      },
      // check xem user_id đã bookmark album_id chưa
      {
        $addFields: {
          is_bookmarked: {
            $in: [new ObjectId(user_id), '$bookmarks.user_id']
          }
        }
      },
      // đếm số lượt bookmark
      {
        $addFields: {
          total_bookmarks: { $size: '$bookmarks' }
        }
      },
      {
        $sort: { createdAt: -1 }
      }
    ])

    return {
      recipes,
      albums
    }
  }
  async requestUpgradeToChefService({ user_id, reason, proof }: RequestUserBody) {
    // tìm user
    const user = await UserModel.findOne({ _id: new ObjectId(user_id) })

    if (!user) {
      throw new ErrorWithStatus({
        message: USER_MESSAGE.USER_NOT_FOUND,
        status: HTTP_STATUS.NOT_FOUND
      })
    }

    // nếu type của user là chef thì không cho gửi request
    if (user.role === UserRoles.chef) {
      throw new ErrorWithStatus({
        message: USER_MESSAGE.CANNOT_UPGRADE,
        status: HTTP_STATUS.BAD_REQUEST
      })
    }

    // nếu user đã gửi request rồi thì không cho gửi nữa
    if (user.upgrade_request?.proof && user.upgrade_request?.reason && user.upgrade_request?.type) {
      throw new ErrorWithStatus({
        message: USER_MESSAGE.REQUEST_ALREADY_SENT,
        status: HTTP_STATUS.BAD_REQUEST
      })
    }
    // nếu user đủ follow thì type = 0, không đủ thì type = 1
    const followCount = await FollowModel.find({ follow_id: new ObjectId(user_id) }).countDocuments()
    console.log(followCount)
    if (followCount >= 3) {
      const upgrade_request = {
        reason: 'Đủ 5000 follow',
        proof: '',
        type: RequestType.follow
      }
      const newUser = await UserModel.findOneAndUpdate(
        { _id: new ObjectId(user_id) },
        { upgrade_request },
        { new: true }
      )
      return newUser
    }

    const upgrade_request = {
      reason,
      proof,
      type: RequestType.proof
    }
    const newUser = await UserModel.findOneAndUpdate({ _id: new ObjectId(user_id) }, { upgrade_request }, { new: true })
    return newUser
  }
}

const usersService = new UsersService()
export default usersService
