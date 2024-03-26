import express, { Express, NextFunction, Request, Response } from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import rateLimit from 'express-rate-limit'
import helmet from 'helmet'
import morgan from 'morgan'
import { envConfig } from './constants/config'
import connectDB from './services/database.services'
import usersRouter from './routes/user.routes'
import blogsRouter from './routes/blog.routes'
import authUserRouter from './routes/authUser.routes'
import { defaultErrorHandler } from './middlewares/error.middleware'
import upload from './utils/multer'
import sharp from 'sharp'
import { deleteFileFromS3, uploadFileToS3 } from './utils/s3'
import postsRouter from './routes/post.routes'
const app: Express = express()
const port = envConfig.port

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false // Disable the `X-RateLimit-*` headers
  // store: ... , // Use an external store for more precise rate limiting
})

app.set('trust proxy', 1) // Trust first proxy

connectDB()
app.use(limiter)
app.use(morgan('combined'))
app.use(helmet())
app.use(cors())
app.use(express.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.get('/', (req: Request, res: Response) => {
  res.send('Hello World!')
})

// app.post('/api/upload', upload.array('image', 5), async (req, res) => {
//   const file = req.files
//   console.log(file)
//   const { content, privacy } = req.body
//   console.log(content, privacy)
//   // console.log(content)
//   // const newBuffer = await sharp(file?.buffer as Buffer)
//   //   .jpeg()
//   //   .toBuffer()
//   // const uploadRes = await uploadFileToS3({
//   //   filename: file?.originalname as string,
//   //   contentType: file?.mimetype as string,
//   //   body: newBuffer
//   // })
//   // console.log(uploadRes)
//   // await deleteFileFromS3('download (1).jpg')
//   res.send('File uploaded')
// })

app.use('/api/auth/users', authUserRouter)
app.use('/api/users', usersRouter)
app.use('/api/blogs', blogsRouter)
app.use('/api/posts', postsRouter)
app.use(defaultErrorHandler)
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
