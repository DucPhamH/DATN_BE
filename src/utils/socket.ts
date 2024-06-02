import { Server } from 'socket.io'
import { Server as ServerHttp } from 'http'
import { TokenPayload } from '~/models/requests/authUser.request'
import { verifyAccessToken } from './common'

const initSocket = (httpServer: ServerHttp) => {
  const io = new Server(httpServer, {
    cors: {
      origin: 'http://localhost:3000'
    }
  })
  const users: {
    [key: string]: {
      socket_id: string
    }
  } = {}

  io.use(async (socket, next) => {
    const token = socket.handshake.auth.token
    console.log(token)
    const access_token = token?.split(' ')[1]
    try {
      const decoded_authorization = await verifyAccessToken(access_token)
      console.log(decoded_authorization)
      // Truyền decoded_authorization vào socket để sử dụng ở các middleware khác
      socket.handshake.auth.decoded_authorization = decoded_authorization
      next()
    } catch (error) {
      next({
        message: 'Unauthorized',
        name: 'UnauthorizedError',
        data: error
      })
    }
  })
  io.on('connection', (socket) => {
    console.log(`user ${socket.id} connected`)
    const user_id = (socket.handshake.auth.decoded_authorization as TokenPayload).user_id
    if (!user_id) {
      return
    }
    users[user_id] = {
      socket_id: socket.id
    }
    console.log(users)

    socket.on('like post', (data) => {
      console.log(data)
      // nếu data.to  === key của user trong users thì return

      if (!users[data.to]) {
        return
      }
      const receiver_socket_id = users[data.to].socket_id

      // console.log('socket_id', socket.id)
      // console.log('receiver_socket_id', receiver_socket_id)

      if (socket.id === receiver_socket_id) {
        console.log('User không tự thông báo like post cho chính mình')
        return
      }

      if (!receiver_socket_id) {
        return
      }
      socket.to(receiver_socket_id).emit('toast like', {
        content: data.content,
        from: user_id,
        name: data.name,
        avatar: data.avatar
      })
    })
    socket.on('disconnect', () => {
      delete users[user_id]
      console.log(`user ${socket.id} disconnected`)
      console.log(users)
    })
  })
}

export default initSocket
