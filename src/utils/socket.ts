import { Server } from 'socket.io'
import { Server as ServerHttp } from 'http'
import { TokenPayload } from '~/models/requests/authUser.request'
import { verifyAccessToken } from './common'
// http://localhost:3000
// https://datn-fe-mu.vercel.app
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

    socket.on('share post', (data) => {
      console.log(data)

      if (!users[data.to]) {
        return
      }

      const receiver_socket_id = users[data.to].socket_id

      if (socket.id === receiver_socket_id) {
        console.log('User không tự thông báo share post cho chính mình')
        return
      }

      if (!receiver_socket_id) {
        return
      }

      socket.to(receiver_socket_id).emit('toast share', {
        content: data.content,
        from: user_id,
        name: data.name,
        avatar: data.avatar
      })
    })

    socket.on('comment post', (data) => {
      console.log(data)

      if (!users[data.to]) {
        return
      }

      const receiver_socket_id = users[data.to].socket_id

      if (socket.id === receiver_socket_id) {
        console.log('User không tự thông báo comment post cho chính mình')
        return
      }

      if (!receiver_socket_id) {
        return
      }

      socket.to(receiver_socket_id).emit('toast comment', {
        content: data.content,
        from: user_id,
        name: data.name,
        avatar: data.avatar
      })
    })

    socket.on('comment child post', (data) => {
      console.log(data)

      if (!users[data.to]) {
        return
      }

      const receiver_socket_id = users[data.to].socket_id

      if (socket.id === receiver_socket_id) {
        console.log('User không tự thông báo comment child post cho chính mình')
        return
      }

      if (!receiver_socket_id) {
        return
      }

      socket.to(receiver_socket_id).emit('toast comment child', {
        content: data.content,
        from: user_id,
        name: data.name,
        avatar: data.avatar
      })
    })

    socket.on('follow', (data) => {
      console.log(data)

      if (!users[data.to]) {
        return
      }

      const receiver_socket_id = users[data.to].socket_id

      if (socket.id === receiver_socket_id) {
        console.log('User không tự thông báo follow cho chính mình')
        return
      }

      if (!receiver_socket_id) {
        return
      }

      socket.to(receiver_socket_id).emit('toast follow', {
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
