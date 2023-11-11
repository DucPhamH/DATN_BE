import { config } from 'dotenv'

config()

export const envConfig = {
  port: (process.env.PORT as string) || 4000
}
