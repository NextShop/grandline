import { inject, injectable } from 'inversify';
import { RequestHandler } from 'express';
import { HttpProxyHandler, GLRouter } from '../../src';

@injectable()
export default class APIRoute implements GLRouter {
  public path = '/api';

  @inject('ProxyHandler')
  private Proxy: HttpProxyHandler;

  middlewares(): RequestHandler[] {
    return [
      (req, res, next) => {
        req.headers['x-id'] = 'Nextpay';
        next();
      },
      this.Proxy.middleware('http://localhost:9999', {
        proxyReqPathResolver(req: any) {
          return `/user${req.url}`;
        },
      }),
    ];
  }
}
