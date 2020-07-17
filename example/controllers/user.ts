import { inject, injectable } from 'inversify';
import { gRPCHandler } from '../../src';

@injectable()
export default class UserController {
  @inject('gRPCHandler')
  private gRPC: gRPCHandler;

  list() {
    return this.gRPC.handle('UserService.list', {
      data: (grpcResponseData: any) => grpcResponseData.users,
      // response(grpcResponseData: any, req: any, res: any) {
      //   res.send('Just a joke!!!');
      // },
    });
  }
}
