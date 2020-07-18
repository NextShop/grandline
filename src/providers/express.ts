import express, { Express, RequestHandler } from 'express';
import { injectable, inject } from 'inversify';
import Logger from './logger';
import Router from './router';
import GLRouter from '../interfaces/utils/grandline_router';

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

  add(route: GLRouter) {
    const router = this.router.create(route);
    this.expressApp.use(route.path, router);
  }

  listen(port: number) {
    this.expressApp.listen(port, () => this.logger.info(`Express server is running on port ${port}`));
  }

  get() {
    return this.expressApp;
  }
}
