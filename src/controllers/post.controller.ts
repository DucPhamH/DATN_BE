import { Request, Response } from 'express'
import HTTP_STATUS from '~/constants/httpStatus'
import { POST_MESSAGE } from '~/constants/messages'
import { TokenPayload } from '~/models/requests/authUser.request'
import postService from '~/services/post.services'
import { ErrorWithStatus } from '~/utils/error'

export const createPostController = async (req: Request, res: Response) => {
  const file = req.files
  const { content, privacy } = req.body
  const user = req.decoded_authorization as TokenPayload
  if (file?.length === 0 && content === '') {
    throw new ErrorWithStatus({
      message: POST_MESSAGE.NO_CONTENT_OR_IMAGE,
      status: HTTP_STATUS.BAD_REQUEST
    })
  }

  const result = await postService.createPostService({ content, privacy, file, user_id: user.user_id })

  return res.json({
    message: POST_MESSAGE.CREATE_POST_SUCCESS,
    result
  })
}
