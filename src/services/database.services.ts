import mongoose, { ConnectOptions } from 'mongoose'
import { envConfig } from '../constants/config'

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
