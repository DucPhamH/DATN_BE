import { ObjectId } from 'mongodb'
import { AlbumStatus, NotificationTypes } from '~/constants/enums'
import HTTP_STATUS from '~/constants/httpStatus'
import { ALBUM_MESSAGE } from '~/constants/messages'
import {
  CreateAlbumBody,
  DeleteRecipeInAlbumForChefBody,
  GetListAlbumForChefQuery,
  GetListAlbumForUserQuery,
  UpdateAlbumForChefBody
} from '~/models/requests/album.request'
import AlbumModel from '~/models/schemas/album.schema'
import BookmarkAlbumModel from '~/models/schemas/bookmarkAlbum.schema'
import NotificationModel from '~/models/schemas/notification.schema'
import RecipeModel from '~/models/schemas/recipe.schema'
import { ErrorWithStatus } from '~/utils/error'

class AlbumService {
  async createAlbumService({ title, description, image, user_id, category_album, array_recipes_id }: CreateAlbumBody) {
    const newAlbum = await AlbumModel.create({
      title,
      description,
      image,
      user_id,
      category_album
    })

    // sửa trường album_id trong bảng recipe có id nằm trong array_recipes_id
    await RecipeModel.updateMany({ _id: { $in: array_recipes_id } }, { album_id: new ObjectId(newAlbum._id) })
    return newAlbum
  }

  async getListAlbumForChefService({
    user_id,
    page,
    limit,
    search,
    category_album,
    sort,
    status
  }: GetListAlbumForChefQuery) {
    const condition: any = {
      user_id: new ObjectId(user_id),
      status: { $ne: AlbumStatus.banned }
    }

    if (status) {
      condition.status = parseInt(status)
    }

    if (search !== undefined) {
      // condition.search_fields = { $regex: search, $options: 'i' }
      condition.$text = { $search: search }
    }

    if (!page) {
      page = 1
    }

    if (!limit) {
      limit = 10
    }

    if (category_album !== undefined) {
      condition.category_album = category_album
    }

    const albums = await AlbumModel.aggregate([
      {
        $match: condition
      },
      {
        $lookup: {
          from: 'recipes',
          localField: '_id',
          foreignField: 'album_id',
          as: 'recipes'
        }
      },
      {
        $sort: { createdAt: sort === 'asc' ? 1 : -1 }
      },
      {
        $skip: (page - 1) * limit
      },
      {
        $limit: limit
      }
    ])

    const totalAlbums = await AlbumModel.countDocuments(condition)
    const totalPage = Math.ceil(totalAlbums / limit)

    return {
      albums,
      totalPage,
      page,
      limit
    }
  }

  async getListMeAlbumService({ user_id, page, limit }: { user_id: string; page: number; limit: number }) {
    if (!page) {
      page = 1
    }

    if (!limit) {
      limit = 10
    }
    const albums = await AlbumModel.aggregate([
      {
        $match: {
          user_id: new ObjectId(user_id),
          status: AlbumStatus.accepted
        }
      },
      {
        $lookup: {
          from: 'recipes',
          localField: '_id',
          foreignField: 'album_id',
          as: 'recipes'
        }
      },
      {
        $sort: { createdAt: -1 }
      },
      {
        $skip: (page - 1) * limit
      },
      {
        $limit: limit
      }
    ])

    const findAlbums = await AlbumModel.find({ user_id: new ObjectId(user_id), status: AlbumStatus.accepted })
    const totalPage = Math.ceil(findAlbums.length / limit)

    return {
      albums,
      totalPage,
      page,
      limit
    }
  }

  async getListUserAlbumService({ user_id, page, limit }: { user_id: string; page: number; limit: number }) {
    if (!page) {
      page = 1
    }

    if (!limit) {
      limit = 10
    }
    const albums = await AlbumModel.aggregate([
      {
        $match: {
          user_id: new ObjectId(user_id),
          status: AlbumStatus.accepted
        }
      },
      {
        $lookup: {
          from: 'recipes',
          localField: '_id',
          foreignField: 'album_id',
          as: 'recipes'
        }
      },
      {
        $sort: { createdAt: -1 }
      },
      {
        $skip: (page - 1) * limit
      },
      {
        $limit: limit
      }
    ])

    const findAlbums = await AlbumModel.find({ user_id: new ObjectId(user_id), status: AlbumStatus.accepted })
    const totalPage = Math.ceil(findAlbums.length / limit)

    return {
      albums,
      totalPage,
      page,
      limit
    }
  }

  async getListAlbumForUserService({ page, limit, search, category_album, sort, status }: GetListAlbumForUserQuery) {
    const condition: any = {
      status: AlbumStatus.accepted
    }

    if (status) {
      condition.status = parseInt(status)
    }

    if (search !== undefined) {
      // condition.search_fields = { $regex: search, $options: 'i' }
      condition.$text = { $search: search }
    }

    if (!page) {
      page = 1
    }

    if (!limit) {
      limit = 8
    }

    if (category_album !== undefined) {
      condition.category_album = category_album
    }

    const albums = await AlbumModel.aggregate([
      {
        $match: condition
      },
      {
        $lookup: {
          from: 'recipes',
          localField: '_id',
          foreignField: 'album_id',
          as: 'recipes'
        }
      },
      {
        $sort: { createdAt: sort === 'asc' ? 1 : -1 }
      },
      {
        $skip: (page - 1) * limit
      },
      {
        $limit: limit
      }
    ])

    const totalAlbums = await AlbumModel.countDocuments(condition)
    const totalPage = Math.ceil(totalAlbums / limit)

    return {
      albums,
      totalPage,
      page,
      limit
    }
  }

  async getAlbumForChefService({ user_id, album_id }: { user_id: string; album_id: string }) {
    const album = await AlbumModel.aggregate([
      {
        $match: {
          _id: new ObjectId(album_id),
          user_id: new ObjectId(user_id)
        }
      },
      {
        $lookup: {
          from: 'recipes',
          localField: '_id',
          foreignField: 'album_id',
          as: 'recipes'
        }
      },
      {
        $unwind: { path: '$recipes', preserveNullAndEmptyArrays: true }
      },
      {
        $lookup: {
          from: 'recipe_categories',
          localField: 'recipes.category_recipe_id',
          foreignField: '_id',
          as: 'recipes.category_recipe'
        }
      },
      {
        $unwind: { path: '$recipes.category_recipe', preserveNullAndEmptyArrays: true }
      },
      // gom recipe lại thành mảng
      {
        $group: {
          _id: '$_id',
          title: { $first: '$title' },
          description: { $first: '$description' },
          image: { $first: '$image' },
          user_id: { $first: '$user_id' },
          status: { $first: '$status' },
          category_album: { $first: '$category_album' },
          recipes: { $push: '$recipes' },
          createdAt: { $first: '$createdAt' },
          updatedAt: { $first: '$updatedAt' }
        }
      }
    ])

    return album
  }

  async getAlbumForUserService({ album_id, user_id }: { album_id: string; user_id: string }) {
    //nối với bảng recipe
    const album = await AlbumModel.aggregate([
      {
        $match: {
          _id: new ObjectId(album_id),
          status: AlbumStatus.accepted
        }
      },
      {
        $lookup: {
          from: 'recipes',
          localField: '_id',
          foreignField: 'album_id',
          as: 'recipes'
        }
      },
      // lookup tới bảng bookmark
      {
        $lookup: {
          from: 'bookmark_albums',
          localField: '_id',
          foreignField: 'album_id',
          as: 'bookmarks'
        }
      },
      // // check xem user_id đã bookmark  album_id chưa
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
      }
    ])

    return album
  }

  async getRecipesInAlbumService({
    album_id,
    user_id,
    limit,
    page
  }: {
    album_id: string
    user_id: string
    limit: number
    page: number
  }) {
    if (!page) {
      page = 1
    }

    if (!limit) {
      limit = 10
    }
    const recipes = await RecipeModel.aggregate([
      {
        $match: {
          album_id: new ObjectId(album_id)
        }
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
      // loại bỏ password của user
      {
        $project: {
          'user.password': 0
        }
      },
      // lookup tới bảng bookmark
      {
        $lookup: {
          from: 'bookmark_recipes',
          localField: '_id',
          foreignField: 'recipe_id',
          as: 'bookmarks'
        }
      },
      // // check xem user_id đã bookmark recipe_id chưa
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
      // nối bảng like
      {
        $lookup: {
          from: 'like_recipes',
          localField: '_id',
          foreignField: 'recipe_id',
          as: 'likes'
        }
      },
      // check xem user_id đã like recipe_id chưa
      {
        $addFields: {
          is_liked: {
            $in: [new ObjectId(user_id), '$likes.user_id']
          }
        }
      },
      // đếm số lượt like
      {
        $addFields: {
          total_likes: { $size: '$likes' }
        }
      },

      // nối bảng comment
      {
        $lookup: {
          from: 'comment_recipes',
          localField: '_id',
          foreignField: 'recipe_id',
          as: 'comments'
        }
      },
      // đếm số lượt comment
      {
        $addFields: {
          total_comments: { $size: '$comments' }
        }
      },
      {
        $sort: { createdAt: -1 }
      },
      {
        $skip: (page - 1) * limit
      },
      {
        $limit: limit
      }
    ])

    const findRecipes = await RecipeModel.find({ album_id: new ObjectId(album_id) })
    const totalPage = Math.ceil(findRecipes.length / limit)

    return {
      recipes,
      totalPage,
      page,
      limit
    }
  }

  async deleteRecipeInAlbumForChefService({ user_id, album_id, recipe_id }: DeleteRecipeInAlbumForChefBody) {
    const album = await AlbumModel.findOne({ _id: album_id, user_id })
    if (!album) {
      throw new ErrorWithStatus({
        message: ALBUM_MESSAGE.ALBUM_NOT_FOUND,
        status: HTTP_STATUS.NOT_FOUND
      })
    }
    // set lại status của album thành pending
    await AlbumModel.findByIdAndUpdate(album_id, { status: AlbumStatus.pending })
    await RecipeModel.findByIdAndUpdate(recipe_id, { album_id: null })
    return true
  }

  async updateAlbumForChefService({
    title,
    description,
    image,
    user_id,
    album_id,
    category_album,
    array_recipes_id
  }: UpdateAlbumForChefBody) {
    const album = await AlbumModel.findOneAndUpdate(
      { _id: album_id, user_id },
      { title, description, image, category_album, status: AlbumStatus.pending },
      { new: true }
    )

    // sửa trường album_id trong bảng recipe có id nằm trong array_recipes_id
    await RecipeModel.updateMany({ _id: { $in: array_recipes_id } }, { album_id: new ObjectId(album_id) })
    return album
  }

  async bookmarkAlbumService({ user_id, album_id }: { user_id: string; album_id: string }) {
    const newBookmark = await BookmarkAlbumModel.findOneAndUpdate(
      {
        user_id: new ObjectId(user_id),
        album_id: new ObjectId(album_id)
      },
      {
        user_id: new ObjectId(user_id),
        album_id: new ObjectId(album_id)
      },
      { upsert: true, new: true }
    )

    const user_album_id = await AlbumModel.findOne({ _id: album_id })

    if (!user_album_id) {
      throw new ErrorWithStatus({
        message: ALBUM_MESSAGE.ALBUM_NOT_FOUND,
        status: HTTP_STATUS.NOT_FOUND
      })
    }

    if (user_album_id.user_id.toString() !== user_id) {
      await NotificationModel.findOneAndUpdate(
        {
          sender_id: new ObjectId(user_id),
          receiver_id: user_album_id.user_id,
          link_id: album_id,
          type: NotificationTypes.bookmarkAlbum
        },
        {
          sender_id: new ObjectId(user_id),
          receiver_id: user_album_id.user_id,
          content: 'Đã lưu album của bạn',
          name_notification: user_album_id.title || 'Album không có tiêu đề',
          link_id: album_id,
          type: NotificationTypes.bookmarkAlbum
        },
        { upsert: true }
      )
    }

    return newBookmark
  }

  async unBookmarkAlbumService({ user_id, album_id }: { user_id: string; album_id: string }) {
    await BookmarkAlbumModel.findOneAndDelete({
      user_id: new ObjectId(user_id),
      album_id: new ObjectId(album_id)
    })
    return true
  }

  async deleleAlbumForChefService({ user_id, album_id }: { user_id: string; album_id: string }) {
    // // xóa album
    // await AlbumModel.findOneAndDelete({ _id: album_id, user_id })
    // // chuyển recipe có album_id = album_id sang album_id = null
    // await RecipeModel.updateMany({ album_id: new ObjectId(album_id) }, { album_id: null })
    // //xóa bookmark album
    // await BookmarkAlbumModel.deleteMany({ album_id: new ObjectId(album_id) })
    await Promise.all([
      AlbumModel.findOneAndDelete({ _id: album_id, user_id }),
      RecipeModel.updateMany({ album_id: new ObjectId(album_id) }, { album_id: null }),
      BookmarkAlbumModel.deleteMany({ album_id: new ObjectId(album_id) })
    ])

    return true
  }
}

const albumService = new AlbumService()

export default albumService
