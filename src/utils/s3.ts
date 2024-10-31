import { S3 } from '@aws-sdk/client-s3'
import { Upload } from '@aws-sdk/lib-storage'
import { envConfig } from '~/constants/config'

const s3 = new S3({
  region: envConfig.AWS_REGION,
  credentials: {
    secretAccessKey: envConfig.AWS_SECRET_ACCESS_KEY,
    accessKeyId: envConfig.AWS_ACCESS_KEY_ID
  }
})
export const uploadFileToS3 = ({
  filename,
  contentType,
  body
}: {
  filename: string
  contentType: string
  body: any
}) => {
  const parallelUploads3 = new Upload({
    client: s3,
    params: {
      Bucket: 'cookhealthy',
      Key: filename,
      Body: body,
      ContentType: contentType
    },
    tags: [
      /*...*/
    ], // optional tags
    queueSize: 4, // optional concurrency configuration
    partSize: 1024 * 1024 * 5, // optional size of each part, in bytes, at least 5MB
    leavePartsOnError: false // optional manually handle dropped parts
  })
  return parallelUploads3.done()
}

export const deleteFileFromS3 = async (filename: string) => {
  try {
    const deleteParams = {
      Bucket: 'cookhealthy',
      Key: filename
    }
    await s3.deleteObject(deleteParams)
  } catch (error) {
    console.log(error)
  }
}
