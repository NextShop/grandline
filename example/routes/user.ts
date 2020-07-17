import { inject, injectable } from 'inversify';
import { RequestHandler } from 'express';
import {
  GLRouter, gRPCHandler, GLEndpoint,
} from '../../src';
import UserController from '../controllers/user';

@injectable()
export default class UserRoute implements GLRouter {
  @inject('gRPCHandler')
  private gRPC: gRPCHandler;

  @inject('UserController')
  private UserController: UserController;

  public path = '/user';

  middlewares(): RequestHandler[] {
    return [
      (req, res, next) => {
        req.headers['x-access-token'] = 'TOKEN';
        next();
      },
    ];
  }

  endpoints(): GLEndpoint[] {
    return [
      { method: 'GET', path: '/', handler: this.UserController.list() },
      {
        method: 'POST',
        path: '/',
        middlewares: [
          this.gRPC.middleware('UserService.list', {
            data(grpcData: any, req: any) {
              (req.grpcData = grpcData.users);
            },
          }),
        ],
        handler: (req: any, res) => res.json(req.grpcData),
      },
      {
        method: 'GET',
        path: '/:id',
        handler: this.gRPC.handle('UserService.getById', {
          transform: (req: any) => ({ id: req.params.id }),
        }),
      },
    ];
  }
}
