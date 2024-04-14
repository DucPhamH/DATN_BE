import moment from 'moment-timezone'
import { ObjectId } from 'mongodb'
import sharp from 'sharp'
import { PostStatus, PostTypes } from '~/constants/enums'
import HTTP_STATUS from '~/constants/httpStatus'
import { POST_MESSAGE } from '~/constants/messages'
import { CreatePostBody } from '~/models/requests/post.request'
import CommentPostModel from '~/models/schemas/commentPost.schema'
import ImagePostModel from '~/models/schemas/imagePost.schema'
import LikePostModel from '~/models/schemas/likePost.schema'
import PostModel from '~/models/schemas/post.schema'
import { ErrorWithStatus } from '~/utils/error'
import { uploadFileToS3 } from '~/utils/s3'

class PostService {
  async createPostService({ content = '', privacy, file = [], user_id }: CreatePostBody) {
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
      // const newFile = await Promise.all(
      //   file.map(async (f: any) => {
      //     f = {
      //       ...f,
      //       originalname: f?.originalname.split('.')[0] + new Date().getTime() + '.' + f?.originalname.split('.')[1],
      //       buffer: await sharp(f?.buffer as Buffer)
      //         .jpeg()
      //         .toBuffer()
      //     }

      //     const uploadRes = await uploadFileToS3({
      //       filename: `post/${f?.originalname}` as string,
      //       contentType: f?.mimetype as string,
      //       body: f?.buffer as Buffer
      //     })
      //     return uploadRes.Location
      //   })
      // )
      // const newImage = newFile.map((f) => {
      // tạm thời để 1 ảnh mặc định
      const newImage = file.map((f: any) => {
        return {
          url: 'https://bepvang.org.vn/Userfiles/Upload/images/Download/2017/2/24/268f41e9fdcd49999f327632ed207db1.jpg',
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
    const post = await PostModel.aggregate([
      {
        // check neu la post cua user thi cho xem ca post private va public cua user do, con khong thi chi xem public
        $match: {
          _id: new ObjectId(post_id),
          is_banned: false,
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

      //bo nhung thu du thua trong bang like, giu lai post_id va user_id
      {
        $addFields: {
          likes: {
            $map: {
              input: '$likes',
              as: 'like',
              in: {
                user_id: '$$like.user_id',
                post_id: '$$like.post_id'
              }
            }
          }
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
      // lay comment cua post
      {
        $lookup: {
          from: 'comment_posts',
          localField: '_id',
          foreignField: 'post_id',
          as: 'comments'
        }
      },

      //loại bỏ những comment bị ban trong mảng comment vừa nối
      {
        $addFields: {
          comments: {
            $filter: {
              input: '$comments',
              as: 'comment',
              cond: { $eq: ['$$comment.is_banned', false] }
            }
          }
        }
      },
      {
        $addFields: {
          comments: {
            $map: {
              input: '$comments',
              as: 'comment',
              in: {
                _id: '$$comment._id',
                content: '$$comment.content',
                user_id: '$$comment.user_id',
                post_id: '$$comment.post_id',
                parent_comment_id: '$$comment.parent_comment_id',
                createdAt: '$$comment.createdAt'
              }
            }
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
      //Nếu có parent_post id thì nếu parent_post bị ban thì không hiển thị còn không thì hiển thị
      //Nếu parent_post id bằng null nếu post bị ban thì không hiển thị còn không thì hiển thị
      {
        $match: {
          $or: [
            {
              'parent_post.is_banned': false
            },
            {
              parent_id: null,
              is_banned: false
            }
          ]
        }
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

      // loại bỏ những post bị ban trong mảng share_posts vừa nối
      {
        $addFields: {
          share_posts: {
            $filter: {
              input: '$share_posts',
              as: 'share_post',
              cond: { $eq: ['$$share_post.is_banned', false] }
            }
          }
        }
      },
      // dem so luong like
      {
        $addFields: {
          like_count: { $size: '$likes' }
        }
      },
      {
        $addFields: {
          comment_count: { $size: '$comments' }
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
  async getNewFeedsService({ user_id, page, limit }: { user_id: string; page: number; limit: number }) {
    if (!limit) {
      limit = 5
    }
    if (!page) {
      page = 1
    }

    const newFeeds = await PostModel.aggregate([
      {
        $match: {
          status: PostStatus.publish,
          is_banned: false
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

      //bo nhung thu du thua trong bang like, giu lai post_id va user_id
      {
        $addFields: {
          likes: {
            $map: {
              input: '$likes',
              as: 'like',
              in: {
                user_id: '$$like.user_id',
                post_id: '$$like.post_id'
              }
            }
          }
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
      // lay commet cua post
      {
        $lookup: {
          from: 'comment_posts',
          localField: '_id',
          foreignField: 'post_id',
          as: 'comments'
        }
      },
      // loại bỏ những comment bị ban trong mảng comment vừa nối
      {
        $addFields: {
          comments: {
            $filter: {
              input: '$comments',
              as: 'comment',
              cond: { $eq: ['$$comment.is_banned', false] }
            }
          }
        }
      },

      {
        $addFields: {
          comments: {
            $map: {
              input: '$comments',
              as: 'comment',
              in: {
                _id: '$$comment._id',
                content: '$$comment.content',
                user_id: '$$comment.user_id',
                post_id: '$$comment.post_id',
                parent_comment_id: '$$comment.parent_comment_id',
                createdAt: '$$comment.createdAt'
              }
            }
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
      //Nếu có parent_post id thì nếu parent_post bị ban thì không hiển thị còn không thì hiển thị
      //Nếu parent_post id bằng null nếu post bị ban thì không hiển thị còn không thì hiển thị
      {
        $match: {
          $or: [
            {
              'parent_post.is_banned': false
            },
            {
              parent_id: null,
              is_banned: false
            }
          ]
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
      // loại bỏ những post bị ban trong mảng share_posts vừa nối
      {
        $addFields: {
          share_posts: {
            $filter: {
              input: '$share_posts',
              as: 'share_post',
              cond: { $eq: ['$$share_post.is_banned', false] }
            }
          }
        }
      },
      // dem so luong like
      {
        $addFields: {
          like_count: { $size: '$likes' }
        }
      },
      {
        $addFields: {
          comment_count: { $size: '$comments' }
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
      },
      {
        $sort: {
          createdAt: -1
        }
      },
      {
        $skip: (page - 1) * limit
      },
      {
        $limit: limit
      }
    ])
    if (!newFeeds) {
      throw new ErrorWithStatus({
        message: POST_MESSAGE.POST_NOT_FOUND,
        status: HTTP_STATUS.NOT_FOUND
      })
    }
    return { newFeeds, page, limit }
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
    parent_id,
    privacy,
    content
  }: {
    user_id: string
    parent_id: string
    privacy: string
    content: string
  }) {
    const newPost = await PostModel.create({
      content: content,
      status: Number(privacy),
      user_id: user_id,
      parent_id: parent_id,
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
  async getCommentsPostService({ post_id, limit, page }: { post_id: string; limit: number; page: number }) {
    if (!limit) {
      limit = 3
    }
    if (!page) {
      page = 1
    }
    const comments = await CommentPostModel.aggregate([
      // chỉ lấy parent comment
      {
        $match: {
          post_id: new ObjectId(post_id),
          parent_comment_id: null,
          is_banned: false
        }
      },
      {
        $lookup: {
          from: 'comment_posts',
          localField: '_id',
          foreignField: 'parent_comment_id',
          as: 'child_comments'
        }
      },
      //loại bỏ những child_comment bị ban trong mảng comment vừa nối
      {
        $addFields: {
          child_comments: {
            $filter: {
              input: '$child_comments',
              as: 'child_comment',
              cond: { $eq: ['$$child_comment.is_banned', false] }
            }
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
        $addFields: {
          child_comments_count: { $size: '$child_comments' }
        }
      },
      {
        $project: {
          'user.password': 0
        }
      },
      {
        $sort: {
          createdAt: -1
        }
      },
      {
        $skip: (page - 1) * limit
      },
      {
        $limit: limit
      }
    ])
    return {
      comments,
      page,
      limit
    }
  }
  async getChildCommentsPostService({
    parent_comment_id,
    limit,
    page
  }: {
    parent_comment_id: string
    limit: number
    page: number
  }) {
    if (!limit) {
      limit = 3
    }
    if (!page) {
      page = 1
    }
    const child_comments = await CommentPostModel.aggregate([
      {
        $match: {
          parent_comment_id: new ObjectId(parent_comment_id),
          is_banned: false
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
        $sort: {
          createdAt: -1
        }
      },
      {
        $skip: (page - 1) * limit
      },
      {
        $limit: limit
      }
    ])
    return {
      child_comments,
      page,
      limit
    }
  }
  async createCommentPostService({
    content,
    user_id,
    post_id,
    parent_comment_id
  }: {
    content: string
    user_id: string
    post_id: string
    parent_comment_id?: string
  }) {
    if (!parent_comment_id) {
      const newComment = await CommentPostModel.create({
        content: content,
        user_id: user_id,
        post_id: post_id
      })
      return newComment
    }
    const newComment = await CommentPostModel.create({
      content: content,
      user_id: user_id,
      post_id: post_id,
      parent_comment_id: parent_comment_id
    })
    return newComment
  }
  async deletePostforEachUserService({ post_id, user_id }: { post_id: string; user_id: string }) {
    await Promise.all([
      PostModel.findOneAndDelete({
        _id: post_id,
        user_id: user_id
      }),
      ImagePostModel.deleteMany({
        post_id: post_id
      }),
      LikePostModel.deleteMany({
        post_id: post_id
      }),
      CommentPostModel.deleteMany({
        post_id: post_id
      })
    ])
    const share_post = await PostModel.find({
      parent_id: post_id
    })
    await Promise.all(
      share_post.map(async (sp) => {
        await Promise.all([
          PostModel.findOneAndDelete({
            _id: sp._id
          }),
          ImagePostModel.deleteMany({
            post_id: sp._id
          }),
          LikePostModel.deleteMany({
            post_id: sp._id
          }),
          CommentPostModel.deleteMany({
            post_id: sp._id
          })
        ])
      })
    )
    return true
  }
  async getMePostsService({ user_id, page, limit }: { user_id: string; page: number; limit: number }) {
    if (!limit) {
      limit = 5
    }
    if (!page) {
      page = 1
    }
    const posts = await PostModel.aggregate([
      {
        $match: {
          user_id: new ObjectId(user_id),
          is_banned: false
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

      //bo nhung thu du thua trong bang like, giu lai post_id va user_id
      {
        $addFields: {
          likes: {
            $map: {
              input: '$likes',
              as: 'like',
              in: {
                user_id: '$$like.user_id',
                post_id: '$$like.post_id'
              }
            }
          }
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
      // lay commet cua post
      {
        $lookup: {
          from: 'comment_posts',
          localField: '_id',
          foreignField: 'post_id',
          as: 'comments'
        }
      },
      // loại bỏ những comment bị ban trong mảng comment vừa nối
      {
        $addFields: {
          comments: {
            $filter: {
              input: '$comments',
              as: 'comment',
              cond: { $eq: ['$$comment.is_banned', false] }
            }
          }
        }
      },

      {
        $addFields: {
          comments: {
            $map: {
              input: '$comments',
              as: 'comment',
              in: {
                _id: '$$comment._id',
                content: '$$comment.content',
                user_id: '$$comment.user_id',
                post_id: '$$comment.post_id',
                parent_comment_id: '$$comment.parent_comment_id',
                createdAt: '$$comment.createdAt'
              }
            }
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
      //Nếu có parent_post id thì nếu parent_post bị ban thì không hiển thị còn không thì hiển thị
      //Nếu parent_post id bằng null nếu post bị ban thì không hiển thị còn không thì hiển thị
      {
        $match: {
          $or: [
            {
              'parent_post.is_banned': false
            },
            {
              parent_id: null,
              is_banned: false
            }
          ]
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
      // loại bỏ những post bị ban trong mảng share_posts vừa nối
      {
        $addFields: {
          share_posts: {
            $filter: {
              input: '$share_posts',
              as: 'share_post',
              cond: { $eq: ['$$share_post.is_banned', false] }
            }
          }
        }
      },
      // dem so luong like
      {
        $addFields: {
          like_count: { $size: '$likes' }
        }
      },
      {
        $addFields: {
          comment_count: { $size: '$comments' }
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
      },
      {
        $sort: {
          createdAt: -1
        }
      },
      {
        $skip: (page - 1) * limit
      },
      {
        $limit: limit
      }
    ])
    if (!posts) {
      throw new ErrorWithStatus({
        message: POST_MESSAGE.POST_NOT_FOUND,
        status: HTTP_STATUS.NOT_FOUND
      })
    }
    return { posts, page, limit }
  }
  async getUserPostsService({
    id,
    user_id,
    page,
    limit
  }: {
    id: string
    user_id: string
    page: number
    limit: number
  }) {
    if (!limit) {
      limit = 5
    }
    if (!page) {
      page = 1
    }
    const posts = await PostModel.aggregate([
      {
        $match: {
          user_id: new ObjectId(id),
          status: PostStatus.publish,
          is_banned: false
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

      //bo nhung thu du thua trong bang like, giu lai post_id va user_id
      {
        $addFields: {
          likes: {
            $map: {
              input: '$likes',
              as: 'like',
              in: {
                user_id: '$$like.user_id',
                post_id: '$$like.post_id'
              }
            }
          }
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
      // lay commet cua post
      {
        $lookup: {
          from: 'comment_posts',
          localField: '_id',
          foreignField: 'post_id',
          as: 'comments'
        }
      },
      // loại bỏ những comment bị ban trong mảng comment vừa nối
      {
        $addFields: {
          comments: {
            $filter: {
              input: '$comments',
              as: 'comment',
              cond: { $eq: ['$$comment.is_banned', false] }
            }
          }
        }
      },

      {
        $addFields: {
          comments: {
            $map: {
              input: '$comments',
              as: 'comment',
              in: {
                _id: '$$comment._id',
                content: '$$comment.content',
                user_id: '$$comment.user_id',
                post_id: '$$comment.post_id',
                parent_comment_id: '$$comment.parent_comment_id',
                createdAt: '$$comment.createdAt'
              }
            }
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
      //Nếu có parent_post id thì nếu parent_post bị ban thì không hiển thị còn không thì hiển thị
      //Nếu parent_post id bằng null nếu post bị ban thì không hiển thị còn không thì hiển thị
      {
        $match: {
          $or: [
            {
              'parent_post.is_banned': false
            },
            {
              parent_id: null,
              is_banned: false
            }
          ]
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
      // loại bỏ những post bị ban trong mảng share_posts vừa nối
      {
        $addFields: {
          share_posts: {
            $filter: {
              input: '$share_posts',
              as: 'share_post',
              cond: { $eq: ['$$share_post.is_banned', false] }
            }
          }
        }
      },
      // dem so luong like
      {
        $addFields: {
          like_count: { $size: '$likes' }
        }
      },
      {
        $addFields: {
          comment_count: { $size: '$comments' }
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
      },
      {
        $sort: {
          createdAt: -1
        }
      },
      {
        $skip: (page - 1) * limit
      },
      {
        $limit: limit
      }
    ])

    if (!posts) {
      throw new ErrorWithStatus({
        message: POST_MESSAGE.POST_NOT_FOUND,
        status: HTTP_STATUS.NOT_FOUND
      })
    }
    return { posts, page, limit }
  }
  async deletecommentPostService({ comment_id, user_id }: { comment_id: string; user_id: string }) {
    const comment = await CommentPostModel.findOne({
      _id: comment_id,
      parent_comment_id: null
    })
    if (comment) {
      const commentId = comment._id
      await Promise.all([
        CommentPostModel.deleteMany({
          parent_comment_id: commentId
        }),
        CommentPostModel.deleteOne({
          _id: commentId
        })
      ])
    }

    return true
  }
  async deleteChildCommentPostService({ comment_id, user_id }: { comment_id: string; user_id: string }) {
    const comment = await CommentPostModel.findOne({
      _id: comment_id
    })
    if (comment) {
      await CommentPostModel.deleteOne({
        _id: comment_id
      })
    }
    return true
  }
}

const postService = new PostService()
export default postService