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
