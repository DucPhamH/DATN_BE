import mongoose, { Types } from 'mongoose'

export interface ReportPost {
  post_id: Types.ObjectId
  reporter_id: Types.ObjectId
  reason: string
}

const ReportPostSchema = new mongoose.Schema<ReportPost>(
  {
    post_id: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'posts',
      required: true
    },
    reporter_id: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'users',
      required: true
    },
    reason: { type: String, required: true }
  },
  {
    timestamps: true,
    collection: 'report_posts'
  }
)

const ReportPostModel = mongoose.model('report_posts', ReportPostSchema)

export default ReportPostModel
