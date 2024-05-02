import { Request, Response } from 'express'
import HTTP_STATUS from '~/constants/httpStatus'
import { POST_MESSAGE } from '~/constants/messages'
import { TokenPayload } from '~/models/requests/authUser.request'
import postService from '~/services/userServices/post.services'
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
  const { parent_id, privacy, content } = req.body
  const user = req.decoded_authorization as TokenPayload
  const result = await postService.sharePostService({ user_id: user.user_id, parent_id, privacy, content })

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

export const getNewFeedsController = async (req: Request, res: Response) => {
  const user = req.decoded_authorization as TokenPayload
  const { limit, page } = req.query
  const result = await postService.getNewFeedsService({
    user_id: user.user_id,
    limit: Number(limit),
    page: Number(page)
  })

  return res.json({
    message: POST_MESSAGE.GET_NEW_FEEDS_SUCCESS,
    result
  })
}

export const getPostCommentsController = async (req: Request, res: Response) => {
  const { post_id, limit, page } = req.query
  const result = await postService.getCommentsPostService({
    post_id: post_id as string,
    limit: Number(limit),
    page: Number(page)
  })

  return res.json({
    message: POST_MESSAGE.GET_POST_COMMENTS_SUCCESS,
    result
  })
}

export const getPostChildCommentsController = async (req: Request, res: Response) => {
  const { parent_comment_id, limit, page } = req.query
  const result = await postService.getChildCommentsPostService({
    parent_comment_id: parent_comment_id as string,
    limit: Number(limit),
    page: Number(page)
  })

  return res.json({
    message: POST_MESSAGE.GET_POST_COMMENTS_SUCCESS,
    result
  })
}

export const createPostCommentController = async (req: Request, res: Response) => {
  const user = req.decoded_authorization as TokenPayload
  const { post_id, content, parent_comment_id } = req.body

  const result = await postService.createCommentPostService({
    user_id: user.user_id,
    post_id,
    content,
    parent_comment_id
  })
  return res.json({
    message: POST_MESSAGE.CREATE_POST_COMMENT_SUCCESS,
    result
  })
}

export const deletePostForEachUserController = async (req: Request, res: Response) => {
  const user = req.decoded_authorization as TokenPayload
  const { post_id } = req.body
  const result = await postService.deletePostforEachUserService({ post_id, user_id: user.user_id })

  return res.json({
    message: POST_MESSAGE.DELETE_POST_SUCCESS,
    result
  })
}

export const getMePostsController = async (req: Request, res: Response) => {
  const user = req.decoded_authorization as TokenPayload
  const { limit, page } = req.query
  const result = await postService.getMePostsService({
    user_id: user.user_id,
    limit: Number(limit),
    page: Number(page)
  })

  return res.json({
    message: POST_MESSAGE.GET_POST_SUCCESS,
    result
  })
}

export const getUserPostController = async (req: Request, res: Response) => {
  const { id } = req.params
  const user = req.decoded_authorization as TokenPayload
  const { limit, page } = req.query
  const result = await postService.getUserPostsService({
    id,
    user_id: user.user_id,
    limit: Number(limit),
    page: Number(page)
  })

  return res.json({
    message: POST_MESSAGE.GET_POST_SUCCESS,
    result
  })
}

export const deleteCommentPostController = async (req: Request, res: Response) => {
  const user = req.decoded_authorization as TokenPayload
  const { comment_id } = req.body
  const result = await postService.deletecommentPostService({ comment_id, user_id: user.user_id })

  return res.json({
    message: POST_MESSAGE.DELETE_COMMENT_POST_SUCCESS,
    result
  })
}

export const deleteChildCommentPostController = async (req: Request, res: Response) => {
  const user = req.decoded_authorization as TokenPayload
  const { comment_id } = req.body
  const result = await postService.deleteChildCommentPostService({ comment_id, user_id: user.user_id })

  return res.json({
    message: POST_MESSAGE.DELETE_COMMENT_POST_SUCCESS,
    result
  })
}

export const createReportPostController = async (req: Request, res: Response) => {
  const user = req.decoded_authorization as TokenPayload
  const { post_id, reason } = req.body
  const result = await postService.createReportPostService({ post_id, user_id: user.user_id, reason })

  return res.json({
    message: POST_MESSAGE.REPORT_POST_SUCCESS,
    result
  })
}
