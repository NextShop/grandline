/* eslint-disable no-restricted-syntax */
/* eslint-disable no-unused-expressions */
import { Router as ExpressRouter, RequestHandler } from 'express';
import { injectable } from 'inversify';
import GLEndpoint from '../interfaces/utils/grandline_endpoint';
import GLRouter from '../interfaces/utils/grandline_router';

@injectable()
export default class Router {
  create(route: GLRouter): ExpressRouter {
    const router = ExpressRouter();

    if(route.middlewares) router.use(...route.middlewares());
    if(route.endpoints) this.registerEndpoints(router, route.endpoints());

    return router;
  }

  async registerEndpoints(router: ExpressRouter, endpoints: GLEndpoint[]) {
    if (endpoints.length === 0) return;

    for (const endpoint of endpoints) {
      const funcs: RequestHandler[] = [];

      // Setup endpoint level custom middlewares
      endpoint.middlewares
        && endpoint.middlewares.length > 0
        && funcs.push(...endpoint.middlewares);

      funcs.push(endpoint.handler);

      // Attach endpoint into router
      switch (endpoint.method.toLowerCase()) {
        case 'get':
          router.get(endpoint.path, ...funcs);
          break;
        case 'post':
          router.post(endpoint.path, ...funcs);
          break;
        case 'delete':
          router.delete(endpoint.path, ...funcs);
          break;
        case 'put':
          router.put(endpoint.path, ...funcs);
          break;
        case 'patch':
          router.patch(endpoint.path, ...funcs);
          break;
        default:
          router.all(endpoint.path, ...funcs);
          break;
      }
    }
  }
}
