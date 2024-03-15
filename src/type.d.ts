import { Request } from 'express'
import { TokenPayload } from './models/requests/authUser.request'

declare module 'express' {
  interface Request {
    decoded_authorization?: TokenPayload
    decoded_refresh_token?: TokenPayload
  }
}
