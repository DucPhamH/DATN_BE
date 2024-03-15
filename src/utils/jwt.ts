import jwt, { SignOptions } from 'jsonwebtoken'
import { envConfig } from '~/constants/config'

export const signToken = ({
  payload,
  privateKey = envConfig.jwtSecret,
  options = {
    algorithm: 'HS256'
  }
}: {
  payload: string | Buffer | object
  privateKey?: string
  options?: SignOptions
}) => {
  return new Promise<string>((resolve, reject) => {
    jwt.sign(payload, privateKey, options, (error, token) => {
      if (error) {
        throw reject(error)
      }
      resolve(token as string)
    })
  })
}
