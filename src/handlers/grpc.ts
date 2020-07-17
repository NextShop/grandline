import { injectable, inject } from 'inversify';
import { RequestHandler, Request, Response } from 'express';
import GLHandler from '../interfaces/utils/grandline_hander';
import GrpcProvider from '../providers/grpc';

interface GrpcHandlerOptions {
  transform?: (req: Request) => void;
  data?: (grpcResponseData: any) => any;
  error?: (err: any, req: Request, res: Response) => void
  response?: (grpcResponseData: any, req: Request, res: Response) => void
}

interface GrpcMiddlewareOptions {
  transform?: (req: Request) => void;
  data?: (grpcResponseData: any, req: Request) => any;
}

@injectable()
export default class GrpcHandler implements GLHandler {
  @inject('gRPC')
  private grpc: GrpcProvider;

  handle(
    fnName: string,
    options: GrpcHandlerOptions,
  ): RequestHandler {
    return (req, res) => {
      const {
        transform, data, response, error,
      } = options;
      let params = { ...req.body, ...req.query, ...req.params };

      /**
       * Invoke transform function to transform data of request to variable that passing to
       * gRPC functions or you wanna use data from req.headers then you have to use transform() too
       */
      if (options && transform && typeof transform === 'function') {
        const transformedParams = transform(req);
        params = Object.assign(params, transformedParams);
      }

      /**
       * Parse gRPC function which includes:
       * - gRPC Service Name
       * - gRPC Function Name
       * - gRPC params(as you can see above)
       */
      const [grpcService, grpcFunction] = fnName.split('.');

      // Calling gRPC and handling response
      this.grpc.call(grpcService, grpcFunction, params, (err: any, resData: any) => {
        if(err) {
          // Invoke gRPC.error hook to handling your error response
          if (options && error && typeof error === 'function') {
            error(err, req, res);
          } else {
            res.json({ success: false, data: err });
          }
        } else {
          // If success
          let grpcResponseData: any = resData;

          // Invoke gRPC.data to reform response data
          if(options && data && typeof data === 'function') {
            grpcResponseData = data(grpcResponseData);
          }

          // Invoke gRPC.response hook to handling your data that response to end user
          if (options && response && typeof response === 'function') {
            response(grpcResponseData, req, res);
          } else {
            res.json({ success: true, data: grpcResponseData });
          }
        }
      });
    };
  }

  middleware(
    fnName: string,
    { transform, data }: GrpcMiddlewareOptions,
  ): RequestHandler {
    return (req, res, next) => {
      let params = { ...req.body, ...req.query, ...req.params };

      /**
       * Invoke transform function to transform data of request to variable that passing to
       * gRPC functions or you wanna use data from req.headers then you have to use transform() too
       */
      if (transform && typeof transform === 'function') {
        const transformedParams = transform(req);
        params = Object.assign(params, transformedParams);
      }

      /**
       * Parse gRPC function which includes:
       * - gRPC Service Name
       * - gRPC Function Name
       * - gRPC params(as you can see above)
       */
      const [grpcService, grpcFunction] = fnName.split('.');

      // Calling gRPC and handling response
      this.grpc.call(grpcService, grpcFunction, params, (err: any, grpcResponseData: any) => {
        if(err) {
          next(err);
        } else {
          // If success: invoke gRPC.data to reform response data
          if(data && typeof data === 'function') data(grpcResponseData, req);

          next();
        }
      });
    };
  }
}
