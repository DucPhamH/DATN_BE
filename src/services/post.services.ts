import sharp from 'sharp'
import HTTP_STATUS from '~/constants/httpStatus'
import { POST_MESSAGE } from '~/constants/messages'
import ImagePostModel from '~/models/schemas/imagePost.schema'
import PostModel from '~/models/schemas/post.schema'
import { ErrorWithStatus } from '~/utils/error'
import { uploadFileToS3 } from '~/utils/s3'

class PostService {
  async createPostService({
    content = '',
    privacy,
    file = [],
    user_id
  }: {
    content: string
    privacy: string
    file: any
    user_id: string
  }) {
    const newPost = await PostModel.create({
      content: content,
      status: Number(privacy),
      user_id: user_id
    })
    if (!newPost) {
      throw new ErrorWithStatus({
        message: POST_MESSAGE.NOT_CREATE_POST,
        status: HTTP_STATUS.BAD_REQUEST
      })
    }

    //su dung sharp de resize mang hinh anh
    if (file?.length > 0) {
      // giu nguyen cac thuoc tinh cua mang chi thay doi buffer
      const newFile = await Promise.all(
        file.map(async (f: any) => {
          f = {
            ...f,
            originalname: f?.originalname.split('.')[0] + new Date().getTime() + '.' + f?.originalname.split('.')[1],
            buffer: await sharp(f?.buffer as Buffer)
              .jpeg()
              .toBuffer()
          }

          const uploadRes = await uploadFileToS3({
            filename: `post/${f?.originalname}` as string,
            contentType: f?.mimetype as string,
            body: f?.buffer as Buffer
          })
          return uploadRes.Location
        })
      )

      // upload anh vao bang image
      const newTmage = await Promise.all(
        newFile.map(async (f: any) => {
          const image = await ImagePostModel.create({
            url: f,
            post_id: newPost._id
          })
          return image
        })
      )
      return {
        post: newPost,
        image: newTmage
      }
    }
    return {
      post: newPost
    }
  }
}

const postService = new PostService()
export default postService
