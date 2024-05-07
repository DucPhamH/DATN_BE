import { ObjectId } from 'mongodb'
import { AlbumStatus } from '~/constants/enums'
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
      condition.search_fields = { $regex: search, $options: 'i' }
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

  async getListAlbumForUserService({ page, limit, search, category_album, sort, status }: GetListAlbumForUserQuery) {
    const condition: any = {
      status: AlbumStatus.accepted
    }

    if (status) {
      condition.status = parseInt(status)
    }

    if (search !== undefined) {
      condition.search_fields = { $regex: search, $options: 'i' }
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

  async getAlbumForUserService({ album_id }: { album_id: string }) {
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
      }
    ])

    return album
  }

  async deleteRecipeInAlbumForChefService({ user_id, album_id, recipe_id }: DeleteRecipeInAlbumForChefBody) {
    const album = await AlbumModel.findOne({ _id: album_id, user_id })
    if (!album) {
      throw new ErrorWithStatus({
        message: ALBUM_MESSAGE.ALBUM_NOT_FOUND,
        status: HTTP_STATUS.NOT_FOUND
      })
    }
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
}

const albumService = new AlbumService()

export default albumService
