import { injectable, inject } from 'inversify';
import { RequestHandler } from 'express';
import HttpProxyProvider from '../providers/http_proxy';
import GLHandler from '../interfaces/utils/grandline_hander';

@injectable()
export default class HttpProxyHandler implements GLHandler {
  @inject('HttpProxy')
  private httpProxy: HttpProxyProvider;

  middleware(target: string, options: any): RequestHandler {
    return this.httpProxy.create(target, options);
  }
}
