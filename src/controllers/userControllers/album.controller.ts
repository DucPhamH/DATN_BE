import { Request, Response } from 'express'
import { ALBUM_MESSAGE } from '~/constants/messages'
import { TokenPayload } from '~/models/requests/authUser.request'
import albumService from '~/services/userServices/album.services'

export const createAlbumController = async (req: Request, res: Response) => {
  const { title, description, image, category_album, array_recipes_id } = req.body
  const user = req.decoded_authorization as TokenPayload
  const result = await albumService.createAlbumService({
    title,
    description,
    image,
    user_id: user.user_id,
    category_album,
    array_recipes_id
  })

  return res.json({
    message: ALBUM_MESSAGE.CREATE_ALBUM_SUCCESS,
    result
  })
}

export const getListAlbumForChefController = async (req: Request, res: Response) => {
  const user = req.decoded_authorization as TokenPayload
  const { page, limit, search, category_album, sort, status } = req.query
  const result = await albumService.getListAlbumForChefService({
    user_id: user.user_id,
    page: Number(page),
    limit: Number(limit),
    search: search as string,
    category_album: category_album as string,
    sort: sort as string,
    status: status as string
  })

  return res.json({
    message: ALBUM_MESSAGE.GET_LIST_ALBUM_SUCCESS,
    result
  })
}

export const getListAlbumForUserController = async (req: Request, res: Response) => {
  const { page, limit, search, category_album, sort, status } = req.query
  const result = await albumService.getListAlbumForUserService({
    page: Number(page),
    limit: Number(limit),
    search: search as string,
    category_album: category_album as string,
    sort: sort as string,
    status: status as string
  })

  return res.json({
    message: ALBUM_MESSAGE.GET_LIST_ALBUM_SUCCESS,
    result
  })
}

export const getAlbumForUserController = async (req: Request, res: Response) => {
  const { id } = req.params
  const user = req.decoded_authorization as TokenPayload
  const result = await albumService.getAlbumForUserService({ album_id: id, user_id: user.user_id })

  return res.json({
    message: ALBUM_MESSAGE.GET_ALBUM_SUCCESS,
    result
  })
}

export const getRecipesInAlbumController = async (req: Request, res: Response) => {
  const { album_id, limit, page } = req.query
  const user = req.decoded_authorization as TokenPayload
  const result = await albumService.getRecipesInAlbumService({
    user_id: user.user_id,
    album_id: album_id as string,
    limit: Number(limit),
    page: Number(page)
  })

  return res.json({
    message: ALBUM_MESSAGE.GET_RECIPES_IN_ALBUM_SUCCESS,
    result
  })
}

export const getAlbumForChefController = async (req: Request, res: Response) => {
  const user = req.decoded_authorization as TokenPayload
  const { id } = req.params
  const result = await albumService.getAlbumForChefService({
    user_id: user.user_id,
    album_id: id
  })

  return res.json({
    message: ALBUM_MESSAGE.GET_ALBUM_SUCCESS,
    result
  })
}

export const deleteRecipeInAlbumForChefController = async (req: Request, res: Response) => {
  const user = req.decoded_authorization as TokenPayload
  const { album_id, recipe_id } = req.body
  const result = await albumService.deleteRecipeInAlbumForChefService({
    user_id: user.user_id,
    album_id,
    recipe_id
  })

  return res.json({
    message: ALBUM_MESSAGE.DELETE_RECIPE_IN_ALBUM_SUCCESS,
    result
  })
}

export const updateAlbumForChefController = async (req: Request, res: Response) => {
  const user = req.decoded_authorization as TokenPayload
  const { id } = req.params
  const { title, description, image, category_album, array_recipes_id } = req.body
  const result = await albumService.updateAlbumForChefService({
    user_id: user.user_id,
    title,
    description,
    image,
    category_album,
    array_recipes_id,
    album_id: id
  })

  return res.json({
    message: ALBUM_MESSAGE.UPDATE_ALBUM_SUCCESS,
    result
  })
}

export const bookmarkAlbumController = async (req: Request, res: Response) => {
  const user = req.decoded_authorization as TokenPayload
  const { album_id } = req.body
  const result = await albumService.bookmarkAlbumService({
    user_id: user.user_id,
    album_id
  })

  return res.json({
    message: ALBUM_MESSAGE.BOOKMARK_ALBUM_SUCCESS,
    result
  })
}

export const unBookmarkAlbumController = async (req: Request, res: Response) => {
  const user = req.decoded_authorization as TokenPayload
  const { album_id } = req.body
  const result = await albumService.unBookmarkAlbumService({
    user_id: user.user_id,
    album_id
  })

  return res.json({
    message: ALBUM_MESSAGE.UN_BOOKMARK_ALBUM_SUCCESS,
    result
  })
}

export const deleteAlbumForChefController = async (req: Request, res: Response) => {
  const user = req.decoded_authorization as TokenPayload
  const { id } = req.params
  const result = await albumService.deleleAlbumForChefService({
    user_id: user.user_id,
    album_id: id
  })

  return res.json({
    message: ALBUM_MESSAGE.DELETE_ALBUM_SUCCESS,
    result
  })
}

export const getListMeAlbumController = async (req: Request, res: Response) => {
  const user = req.decoded_authorization as TokenPayload
  const { page, limit } = req.query
  const result = await albumService.getListMeAlbumService({
    user_id: user.user_id,
    page: Number(page),
    limit: Number(limit)
  })

  return res.json({
    message: ALBUM_MESSAGE.GET_LIST_ALBUM_SUCCESS,
    result
  })
}

export const getListUserAlbumController = async (req: Request, res: Response) => {
  const { id } = req.params
  const { page, limit } = req.query
  const result = await albumService.getListUserAlbumService({
    user_id: id,
    page: Number(page),
    limit: Number(limit)
  })

  return res.json({
    message: ALBUM_MESSAGE.GET_LIST_ALBUM_SUCCESS,
    result
  })
}
