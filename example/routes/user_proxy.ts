import { RouteConfigFunction } from '../../src';

const userRoute: RouteConfigFunction = ({ Proxy }) => ({
  path: '/user-proxy',
  middlewares: [
    Proxy.middleware('http://localhost:9999', {
      proxyReqPathResolver(req: any) {
        return `/user${req.url}`;
      },
    }),
  ],
});

export default userRoute;
