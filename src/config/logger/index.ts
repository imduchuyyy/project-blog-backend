import { Logger } from '@nestjs/common'

export function MyLogger(req, res, next) {
  // logger.debug(`💬  ${req.headers['user-agent']}`)
  Logger.debug(
    `💬  ${
    req.headers['user-agent']
      ? req.headers['user-agent'].split(') ')[0]
      : req.headers
    })`,
    'Bootstrap',
    false
  )
  next()
}
