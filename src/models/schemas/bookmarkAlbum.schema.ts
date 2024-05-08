import mongoose, { Types } from 'mongoose'

export interface BookmarkAlbum {
  user_id: Types.ObjectId
  album_id: Types.ObjectId
}

const BookmarkAlbumSchema = new mongoose.Schema<BookmarkAlbum>(
  {
    user_id: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'users',
      required: true
    },
    album_id: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'albums',
      required: true
    }
  },
  {
    timestamps: true,
    collection: 'bookmark_albums'
  }
)

const BookmarkAlbumModel = mongoose.model('bookmark_albums', BookmarkAlbumSchema)

export default BookmarkAlbumModel
