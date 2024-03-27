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

export const likePostController = async (req: Request, res: Response) => {
  const { post_id } = req.body
  const user = req.decoded_authorization as TokenPayload
  const result = await postService.likePostService({ post_id, user_id: user.user_id })

  return res.json({
    message: POST_MESSAGE.LIKE_POST_SUCCESS,
    result
  })
}

export const unLikePostController = async (req: Request, res: Response) => {
  const { post_id } = req.body
  const user = req.decoded_authorization as TokenPayload
  const result = await postService.unLikePostService({ post_id, user_id: user.user_id })

  return res.json({
    message: POST_MESSAGE.UNLIKE_POST_SUCCESS,
    result
  })
}

export const sharePostController = async (req: Request, res: Response) => {
  const { post_id, privacy, content } = req.body
  const user = req.decoded_authorization as TokenPayload
  const result = await postService.sharePostService({ user_id: user.user_id, post_id, privacy, content })

  return res.json({
    message: POST_MESSAGE.SHARE_POST_SUCCESS,
    result
  })
}

export const getPostController = async (req: Request, res: Response) => {
  const { post_id } = req.params
  const user = req.decoded_authorization as TokenPayload
  const result = await postService.getPostService({ post_id, user_id: user.user_id })

  return res.json({
    message: POST_MESSAGE.GET_POST_SUCCESS,
    result
  })
}
