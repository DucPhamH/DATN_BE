import { config } from 'dotenv'

config()

export const envConfig = {
  port: (process.env.PORT as string) || 4000,
  mongoURL: process.env.MONGODB_URL as string,
  jwtSecret: process.env.JWT_SECRET as string,
  ACCESS_TOKEN_EXPIRES_IN: process.env.ACCESS_TOKEN_EXPIRES_IN as string,
  REFRESH_TOKEN_EXPIRES_IN: process.env.REFRESH_TOKEN_EXPIRES_IN as string,
  JWT_SECRET_REFRESH_TOKEN: process.env.JWT_SECRET_REFRESH_TOKEN as string,
  JWT_SECRET_ACCESS_TOKEN: process.env.JWT_SECRET_ACCESS_TOKEN as string,
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID as string,
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET as string,
  GOOGLE_REDIRECT_URI: process.env.GOOGLE_REDIRECT_URI as string,
  CLIENT_REDIRECT_CALLBACK: process.env.CLIENT_REDIRECT_CALLBACK as string,
  AWS_REGION: process.env.AWS_REGION as string,
  AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY as string,
  AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID as string,
  SES_FROM_ADDRESS: process.env.SES_FROM_ADDRESS as string,
  EMAIL_PASSWORD: process.env.EMAIL_PASSWORD as string,
  ACCESS_TOKEN_ADMIN_EXPIRES_IN: process.env.ACCESS_TOKEN_ADMIN_EXPIRES_IN as string
}
