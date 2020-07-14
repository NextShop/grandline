import { injectable, inject } from 'inversify';
import { RequestHandler } from 'express';
import HttpProxyProvider from '../providers/http_proxy';
import GatewayHandler from '../interfaces/utils/gateway_hander';

@injectable()
export default class HttpProxyHandler implements GatewayHandler {
  @inject('HttpProxy')
  private httpProxy: HttpProxyProvider;

  middleware(target: string, options: any): RequestHandler {
    return this.httpProxy.create(target, options);
  }
}
