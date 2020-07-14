import { RouteConfigFunction } from '../../src';

const userRoute: RouteConfigFunction = ({ gRPC }) => ({
  path: '/user',
  middlewares: [
    (req, res, next) => {
      req.headers['x-access-token'] = 'TOKEN';

      next();
    },
  ],
  endpoints: [
    // Demo data function and response function
    {
      method: 'GET',
      path: '/',
      handler: gRPC.handle('UserService.list', {
        data: (grpcResponseData: any) => grpcResponseData.users,
        // response(grpcResponseData: any, req: any, res: any) {
        //   res.send('Just a joke!!!');
        // },
      }),
    },

    // GRPC Handler as a Middleware
    {
      method: 'GET',
      path: '/',
      middlewares: [
        gRPC.middleware('UserService.list', {
          data(grpcData: any, req: any) {
            (req.grpcData = grpcData.users);
          },
        }),
      ],
      handler: (req: any, res) => res.json(req.grpcData),
    },

    // Power of transform function
    {
      method: 'GET',
      path: '/:id',
      handler: gRPC.handle('UserService.getById', {
        transform: (req: any) => ({ id: req.params.id }),
      }),
    },
  ],
});

export default userRoute;
