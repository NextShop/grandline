import { injectable, inject } from 'inversify';
import grpc, { GrpcObject } from 'grpc';
import { loadSync } from '@grpc/proto-loader';
import winston from 'winston';

@injectable()
export default class GrpcProvider {
  private GrpcServices: GrpcObject;

  private services: {[name: string] : any} = {};

  @inject('AppLogger') private logger: winston.Logger;

  @inject('APP_ROOT') private appRoot: string;

  loadProtos(GRPC_PATH: string, init: (services: GrpcObject) => any) {
    const packageDefinition = loadSync(`${this.appRoot}/${GRPC_PATH}`, {
      keepCase: true,
      longs: String,
      enums: String,
      defaults: true,
      oneofs: true,
    });

    this.GrpcServices = grpc.loadPackageDefinition(packageDefinition);
    this.services = init(this.GrpcServices);

    Object.keys(this.services).forEach(
      (serviceName) => this.logger.info(`GRPC ${serviceName} is loaded`),
    );
  }

  getServices() {
    return this.services;
  }

  getService(svc: string): {[name: string]: Function} {
    return this.services[svc];
  }

  call(svc: string, func: string, args?: any, cb?: Function) {
    // Calling gRPC and handling response
    this.getService(svc)[func](args, cb);
  }
}
