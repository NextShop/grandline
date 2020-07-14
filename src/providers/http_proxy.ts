import { injectable } from 'inversify';
import proxy from 'express-http-proxy';

@injectable()
export default class HttpProxyProvider {
  create(target: string, options: any) {
    return proxy(target, options);
  }
}
