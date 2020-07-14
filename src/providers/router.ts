/* eslint-disable no-restricted-syntax */
/* eslint-disable no-unused-expressions */
import { Router as ExpressRouter, RequestHandler } from 'express';
import { injectable } from 'inversify';
import { RouteConfigFunction } from '../interfaces/utils/route_config';
import GatewayHandler from '../interfaces/utils/gateway_hander';
import RouteConfigs from '../interfaces/configs/route';

@injectable()
export default class Router {
  create(
    routeConfigFn: RouteConfigFunction,
    handlers: {[name: string]: GatewayHandler},
  ): {router: ExpressRouter, path: string} {
    const router = ExpressRouter();
    const routeConfig = routeConfigFn(handlers);
    this.registerEndpoints(router, routeConfig);
    return { path: routeConfig.path, router };
  }

  async registerEndpoints(router: ExpressRouter, routeConfig: RouteConfigs) {
    // Setup router level middlewares
    routeConfig.middlewares
      && routeConfig.middlewares.length > 0
      && router.use(...routeConfig.middlewares);

    if (!routeConfig.endpoints) return;

    for (const endpoint of routeConfig.endpoints) {
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
