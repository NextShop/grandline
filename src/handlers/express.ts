import { injectable } from 'inversify';
import { RequestHandler } from 'express';
import GLHandler from '../interfaces/utils/grandline_hander';

@injectable()
export default class ExpressHandler implements GLHandler {
  handle(requestHandler: RequestHandler): RequestHandler {
    return requestHandler;
  }
}
