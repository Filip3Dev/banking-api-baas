import messages from '_config/middlewares/messages'
import { SECRET } from '_core/constants'
import { HttpStatusCode } from '_core/enums'
import { NextFunction, Request, Response } from 'express'

export const authorization = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
  if (!req.headers.secret) {
    return res.status(HttpStatusCode.UNAUTHORIZED).json({
      code: HttpStatusCode.UNAUTHORIZED,
      message: {
        name: messages.secretKeyNotProvided.name,
        message: messages.secretKeyNotProvided.message,
        codeAsString: messages.secretKeyNotProvided.code,
      },
    })
  }

  const secret = req.headers.secret

  if (!secret || secret != SECRET.key) {
    return res.status(HttpStatusCode.UNAUTHORIZED).json({
      code: HttpStatusCode.UNAUTHORIZED,
      message: {
        name: messages.invalidSecretKey.name,
        message: messages.invalidSecretKey.message,
        codeAsString: messages.invalidSecretKey.code,
      },
    })
  }

  next()
}
