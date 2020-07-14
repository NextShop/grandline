import { RequestHandler } from 'express';

export default interface EndpointConfigs {
  path: string
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'UPDATE' | 'PATCH' | 'ALL'
  middlewares?: RequestHandler[]
  handler?: RequestHandler
}
