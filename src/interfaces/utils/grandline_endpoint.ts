import { RequestHandler } from 'express';

export default interface GLEndpoint {
  path: string
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'UPDATE' | 'PATCH' | 'ALL'
  middlewares?: RequestHandler[]
  handler?: RequestHandler
}
