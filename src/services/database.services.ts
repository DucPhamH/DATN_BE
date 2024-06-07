import mongoose, { ConnectOptions } from 'mongoose'
import { envConfig } from '../constants/config'

console.log(envConfig.mongoURL)

const connectDB = async () => {
  try {
    const options: ConnectOptions = {}
    await mongoose.connect(envConfig.mongoURL, options)
    console.log('Connected to mongoDB')
  } catch (error) {
    console.log(error)
    process.exit(1)
  }
}

export default connectDB
