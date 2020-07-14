import { RequestHandler } from 'express';

export default interface MiddlewareConfigs {
  path?: string | string[]
  handlers: RequestHandler[]
}
