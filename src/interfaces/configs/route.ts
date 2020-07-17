import { RequestHandler } from 'express';
import EndpointConfigs from '../utils/grandline_endpoint';

export default interface RouteConfigs {
  path: string,
  middlewares?: RequestHandler[]
  endpoints?: EndpointConfigs[]
}
