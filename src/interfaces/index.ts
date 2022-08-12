import { Logger } from '_core/adapter/interfaces/logger-interfaces'
import adminJsConfig from '_interfaces/adminjs'
import { loadExpress } from '_interfaces/express'
import { loadWebSocket } from '_interfaces/socket.io'
import bodyParser from 'body-parser'
import { Application } from 'express'
import * as HTTPServer from 'http'
import socketIO from 'socket.io'

type LoadedInterfaces = {
  http: Application
  socketIO: socketIO.Server
  adminJsConfig: typeof adminJsConfig
}

export const loadInterfaces = (logger: Logger): LoadedInterfaces => {
  const http = loadExpress(logger)
  const socket = loadWebSocket(logger)

  adminJsConfig.then(({ adminJs, adminJsRouter }) => {
    http.use(adminJs.options.rootPath, adminJsRouter)

    // MIDDLEWARES THAT MUST BE SET AFTER SETTING ADMINJS
    http.use(bodyParser.json())
    http.use(bodyParser.urlencoded({ extended: true }))
  })

  const server: HTTPServer.Server = HTTPServer.createServer(http)
  const socketIO: socketIO.Server = socket(server)

  //AWS LOAD BALANCE FIX
  server.keepAliveTimeout = 61 * 1000
  server.headersTimeout = 65 * 1000

  return { http, socketIO, adminJsConfig }
}
