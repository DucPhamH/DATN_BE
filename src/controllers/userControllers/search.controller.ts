import { Request, Response } from 'express'
import { SEARCH_MESSAGE } from '~/constants/messages'
import { TokenPayload } from '~/models/requests/authUser.request'
import searchService from '~/services/userServices/search.services'

export const searchController = async (req: Request, res: Response) => {
  const { search } = req.query
  const user = req.decoded_authorization as TokenPayload
  const result = await searchService.searchAllItemsService({
    search: search as string,
    user_id: user.user_id
  })
  return res.json({
    result,
    message: SEARCH_MESSAGE.SEARCH_SUCCESS
  })
}
