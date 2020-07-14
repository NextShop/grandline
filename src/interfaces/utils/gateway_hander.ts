import { RequestHandler } from 'express';

export default interface GatewayHandler {
  handle?: (...args: any) => RequestHandler
  middleware?: (...args: any) => RequestHandler
}
