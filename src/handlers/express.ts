import { injectable } from 'inversify';
import { RequestHandler } from 'express';
import GatewayHandler from '../interfaces/utils/gateway_hander';

@injectable()
export default class ExpressHandler implements GatewayHandler {
  handle(requestHandler: RequestHandler): RequestHandler {
    return requestHandler;
  }
}
