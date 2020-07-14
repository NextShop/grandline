import express, { Express, RequestHandler } from 'express';
import { injectable, inject } from 'inversify';
import Logger from './logger';
import Router from './router';

import { RouteConfigFunction } from '../interfaces/utils/route_config';
import GatewayHandler from '../interfaces/utils/gateway_hander';

@injectable()
export default class ExpressProvider {
  private expressApp: Express = express();

  private logger = Logger.createModule('Express');

  private routers: any[] = [];

  @inject('Router')
  private router: Router;

  use(path: string, router: RequestHandler) {
    this.expressApp.use(path, router);
  }

  add(routeConfigFn: RouteConfigFunction, handlers: {[name: string ] : GatewayHandler}) {
    const expressModule = this.router.create(routeConfigFn, handlers);

    this.routers.push(expressModule.router);

    this.expressApp.use(expressModule.path, expressModule.router);
  }

  listen(port: number) {
    this.expressApp.listen(port, () => this.logger.info(`Express server is running on port ${port}`));
  }
}