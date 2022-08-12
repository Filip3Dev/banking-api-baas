import { Logger } from '_core/adapter/interfaces/logger-interfaces'
import http from 'http'
import SocketIO from 'socket.io'

export const loadWebSocket = (logger: Logger): SocketIO.Server => {
  const socket = (server: http.Server): SocketIO.Server => SocketIO(server)
  logger.info(`Loaded => socket.io`)

  return socket
}
