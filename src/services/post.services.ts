import { ObjectId } from 'mongodb'
import sharp from 'sharp'
import { PostStatus, PostTypes } from '~/constants/enums'
import HTTP_STATUS from '~/constants/httpStatus'
import { POST_MESSAGE } from '~/constants/messages'
import ImagePostModel from '~/models/schemas/imagePost.schema'
import LikePostModel from '~/models/schemas/likePost.schema'
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
      user_id: new ObjectId(user_id)
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
      const newImage = newFile.map((f) => {
        return {
          url: f,
          post_id: newPost._id
        }
      })
      const images = await ImagePostModel.insertMany(newImage)
      return {
        post: newPost,
        image: images
      }
    }
    return {
      post: newPost
    }
  }
  async getPostService({ post_id, user_id }: { post_id: string; user_id: string }) {
    console.log(post_id, user_id)
    const post = await PostModel.aggregate([
      {
        // check neu la post cua user thi cho xem ca post private va public cua user do, con khong thi chi xem public
        $match: {
          _id: new ObjectId(post_id),
          $or: [
            {
              status: PostStatus.publish
            },
            {
              status: PostStatus.private,
              user_id: new ObjectId(user_id)
            }
          ]
        }
      },
      {
        $lookup: {
          from: 'image_posts',
          localField: '_id',
          foreignField: 'post_id',
          as: 'images'
        }
      },
      // lay url cua array anh
      {
        $addFields: {
          images: {
            $map: {
              input: '$images',
              as: 'image',
              in: '$$image.url'
            }
          }
        }
      },
      {
        $lookup: {
          from: 'like_posts',
          localField: '_id',
          foreignField: 'post_id',
          as: 'likes'
        }
      },
      // check neu user da like post thi tra ve true, con khong thi tra ve false
      {
        $addFields: {
          is_like: {
            $in: [new ObjectId(user_id), '$likes.user_id']
          }
        }
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
      {
        $lookup: {
          from: 'posts',
          localField: 'parent_id',
          foreignField: '_id',
          as: 'parent_post'
        }
      },
      {
        $unwind: { path: '$parent_post', preserveNullAndEmptyArrays: true }
      },
      //lay image array cua post cha
      {
        $lookup: {
          from: 'image_posts',
          localField: 'parent_post._id',
          foreignField: 'post_id',
          as: 'parent_images'
        }
      },
      {
        $addFields: {
          parent_images: {
            $map: {
              input: '$parent_images',
              as: 'image',
              in: '$$image.url'
            }
          }
        }
      },
      // noi parent_post voi user de lay thong tin user cua post cha
      {
        $lookup: {
          from: 'users',
          localField: 'parent_post.user_id',
          foreignField: '_id',
          as: 'parent_user'
        }
      },
      {
        $unwind: { path: '$parent_user', preserveNullAndEmptyArrays: true }
      },
      {
        $lookup: {
          from: 'posts',
          localField: '_id',
          foreignField: 'parent_id',
          as: 'share_posts'
        }
      },
      // dem so luong like
      {
        $addFields: {
          like_count: { $size: '$likes' }
        }
      },
      //dem so luong share
      {
        $addFields: {
          share_count: { $size: '$share_posts' }
        }
      },
      // bo het password cua user va parent_user
      {
        $project: {
          'user.password': 0,
          'parent_user.password': 0
        }
      }
    ])
    if (!post || post.length === 0) {
      throw new ErrorWithStatus({
        message: POST_MESSAGE.POST_NOT_FOUND,
        status: HTTP_STATUS.NOT_FOUND
      })
    }
    return post
  }
  async likePostService({ user_id, post_id }: { user_id: string; post_id: string }) {
    const newLike = await LikePostModel.findOneAndUpdate(
      {
        user_id: user_id,
        post_id: post_id
      },
      {
        user_id: user_id,
        post_id: post_id
      },
      {
        upsert: true,
        new: true
      }
    )
    return newLike
  }
  async unLikePostService({ user_id, post_id }: { user_id: string; post_id: string }) {
    const newLike = await LikePostModel.findOneAndDelete({
      user_id: user_id,
      post_id: post_id
    })
    return newLike
  }
  async sharePostService({
    user_id,
    post_id,
    privacy,
    content
  }: {
    user_id: string
    post_id: string
    privacy: string
    content: string
  }) {
    const newPost = await PostModel.create({
      content: content,
      status: Number(privacy),
      user_id: user_id,
      parent_id: post_id,
      type: PostTypes.sharePost
    })
    if (!newPost) {
      throw new ErrorWithStatus({
        message: POST_MESSAGE.NOT_CREATE_POST,
        status: HTTP_STATUS.BAD_REQUEST
      })
    }
    return newPost
  }
}

const postService = new PostService()
export default postService
