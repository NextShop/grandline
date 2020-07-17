import { RequestHandler } from 'express';
import GLEndpoint from './grandline_endpoint';

type middlewareFunc = () => RequestHandler[];
type endpointFunc = () => GLEndpoint[];

export default interface GLRouter {
  path: string
  middlewares?: middlewareFunc
  endpoints?: endpointFunc
}
