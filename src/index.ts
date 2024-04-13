import express, { Express, NextFunction, Request, Response } from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import rateLimit from 'express-rate-limit'
import helmet from 'helmet'
import morgan from 'morgan'
import { envConfig } from './constants/config'
import connectDB from './services/database.services'
import usersRouter from './routes/userRoutes/user.routes'
import blogsRouter from './routes/userRoutes/blog.routes'
import authUserRouter from './routes/userRoutes/authUser.routes'
import { defaultErrorHandler } from './middlewares/error.middleware'

import postsRouter from './routes/userRoutes/post.routes'
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
app.use(express.json({ limit: '50mb' }))
app.use(express.urlencoded({ limit: '50mb' }))
app.use(bodyParser.urlencoded({ extended: false, limit: '50mb', parameterLimit: 50000 }))
app.use(
  bodyParser.json({
    limit: '50mb'
  })
)

app.get('/', (req: Request, res: Response) => {
  res.send('Hello World!')
})

app.use('/api/auth/users', authUserRouter)
app.use('/api/users', usersRouter)
app.use('/api/blogs', blogsRouter)
app.use('/api/posts', postsRouter)
app.use(defaultErrorHandler)
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
