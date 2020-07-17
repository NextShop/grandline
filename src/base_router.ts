import { RequestHandler } from 'express';
import { injectable } from 'inversify';
import GLRouter from './interfaces/utils/grandline_router';
import EndpointConfigs from './interfaces/utils/grandline_endpoint';

@injectable()
export default class GLBaseRouter implements GLRouter {
  public path = '/';

  public routerEndpoints: EndpointConfigs[]= [];

  public routerMiddlewares: RequestHandler[];

  constructor() {
    this.init();
  }

  init() {}

  addEndpoint(
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'UPDATE' | 'PATCH' | 'ALL',
    path: string,
    handler?: RequestHandler,
    middlewares?: RequestHandler[],
  ) {
    this.routerEndpoints.push({
      method, path, handler, middlewares,
    });
  }

  addMiddleware(middleware: RequestHandler) {
    this.routerMiddlewares.push(middleware);
  }

  endpoints() {
    return this.routerEndpoints;
  }

  middlewares() {
    return this.routerMiddlewares;
  }
}
