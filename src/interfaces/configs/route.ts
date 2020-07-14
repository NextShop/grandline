import { RequestHandler } from 'express';
import EndpointConfigs from './endpoint';

export default interface RouteConfigs {
  path: string,
  middlewares?: RequestHandler[]
  endpoints?: EndpointConfigs[]
}
