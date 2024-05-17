import { ObjectId } from 'mongodb'
import { PostStatus, RecipeStatus, UserRoles, UserStatus } from '~/constants/enums'
import FollowModel from '~/models/schemas/follow.schema'
import PostModel from '~/models/schemas/post.schema'
import RecipeModel from '~/models/schemas/recipe.schema'
import UserModel from '~/models/schemas/user.schema'

class SearchService {
  async searchAllItemsService({ search, user_id }: { search: string; user_id: string }) {
    const condition: any = {}
    if (search !== undefined) {
      condition.$text = { $search: search }
    }

    const user_id_obj = new ObjectId(user_id)
    // tìm những tài khoản mà user đã theo dõi
    const follow_ids = await FollowModel.find({
      user_id: user_id_obj
    }).select('follow_id')

    const follow_ids_arr = follow_ids.map((f) => f.follow_id)
    follow_ids_arr.push(user_id_obj)
    console.log(follow_ids_arr)

    const users = await UserModel.aggregate([
      {
        $match: condition
      },
      // lấy user không bị ban và không phải là mình
      {
        $match: {
          _id: { $ne: new ObjectId(user_id) },
          status: UserStatus.active,
          // role phải khác admin, người kiểm duyệt và người viết bài
          role: { $nin: [UserRoles.admin, UserRoles.inspector, UserRoles.writter] }
        }
      },
      {
        $lookup: {
          from: 'follows',
          localField: '_id',
          foreignField: 'follow_id',
          as: 'follows'
        }
      },
      {
        $addFields: {
          is_following: {
            $in: [new ObjectId(user_id), '$follows.user_id']
          }
        }
      },
      {
        $project: {
          password: 0,
          pre_weight: 0,
          otp_code: 0,
          follows: 0
        }
      },
      // lấy tối đa 10 user
      {
        $limit: 10
      }
    ])

    const posts = await PostModel.aggregate([
      {
        $match: condition
      },
      {
        // lấy post public và những post trong trạng thái chỉ cho người đã theo dõi xem
        $match: {
          $or: [
            {
              status: PostStatus.publish
            },
            {
              status: PostStatus.following,
              user_id: { $in: follow_ids_arr }
            }
          ],
          is_banned: false,
          // loại những bài post của mình
          user_id: { $ne: new ObjectId(user_id) }
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
      // lấy tối đa 10 post
      {
        $limit: 10
      }
    ])

    const recipes = await RecipeModel.aggregate([
      {
        $match: condition
      },

      {
        $match: {
          status: RecipeStatus.accepted
        }
      },
      {
        $lookup: {
          from: 'recipe_categories',
          localField: 'category_recipe_id',
          foreignField: '_id',
          as: 'category_recipe'
        }
      },
      {
        $unwind: '$category_recipe'
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
      // loại bỏ password của user
      {
        $project: {
          'user.password': 0
        }
      },
      // lookup tới bảng bookmark
      {
        $lookup: {
          from: 'bookmark_recipes',
          localField: '_id',
          foreignField: 'recipe_id',
          as: 'bookmarks'
        }
      },
      // // check xem user_id đã bookmark recipe_id chưa
      {
        $addFields: {
          is_bookmarked: {
            $in: [new ObjectId(user_id), '$bookmarks.user_id']
          }
        }
      },
      // đếm số lượt bookmark
      {
        $addFields: {
          total_bookmarks: { $size: '$bookmarks' }
        }
      },
      // nối bảng like
      {
        $lookup: {
          from: 'like_recipes',
          localField: '_id',
          foreignField: 'recipe_id',
          as: 'likes'
        }
      },
      // check xem user_id đã like recipe_id chưa
      {
        $addFields: {
          is_liked: {
            $in: [new ObjectId(user_id), '$likes.user_id']
          }
        }
      },
      // đếm số lượt like
      {
        $addFields: {
          total_likes: { $size: '$likes' }
        }
      },

      // nối bảng comment
      {
        $lookup: {
          from: 'comment_recipes',
          localField: '_id',
          foreignField: 'recipe_id',
          as: 'comments'
        }
      },
      // đếm số lượt comment
      {
        $addFields: {
          total_comments: { $size: '$comments' }
        }
      },
      {
        $sort: {
          createdAt: -1
        }
      },
      // lấy tối đa 10 recipe
      {
        $limit: 10
      }
    ])

    return { users, posts, recipes }
  }
}

const searchService = new SearchService()

export default searchService
