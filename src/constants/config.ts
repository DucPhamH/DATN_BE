import { config } from 'dotenv'

config()

export const envConfig = {
  port: (process.env.PORT as string) || 4000,
  mongoURL: process.env.MONGODB_URL as string,
  jwtSecret: process.env.JWT_SECRET as string,
  ACCESS_TOKEN_EXPIRES_IN: process.env.ACCESS_TOKEN_EXPIRES_IN as string,
  REFRESH_TOKEN_EXPIRES_IN: process.env.REFRESH_TOKEN_EXPIRES_IN as string
}
