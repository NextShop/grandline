import { injectable, inject } from 'inversify';
import grpc, { GrpcObject } from 'grpc';
import { loadSync } from '@grpc/proto-loader';
import winston from 'winston';
import Config from './config';

@injectable()
export default class GrpcProvider {
  private GrpcServices: GrpcObject;

  private services: {[name: string] : any};

  constructor(
    @inject('AppLogger') private logger: winston.Logger,
    @inject('Config') private config: Config,
  ) {
    const GRPC_PATH = `${this.config.get('APP_ROOT')}/${this.config.get('grpc').PATH}`;
    this.loadProtos(GRPC_PATH);
  }

  loadProtos(GRPC_PATH: string) {
    const packageDefinition = loadSync(GRPC_PATH, {
      keepCase: true,
      longs: String,
      enums: String,
      defaults: true,
      oneofs: true,
    });

    this.GrpcServices = grpc.loadPackageDefinition(packageDefinition);
    this.services = this.config.get('grpc').init(this.GrpcServices);
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
