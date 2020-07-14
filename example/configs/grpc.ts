import grpc from 'grpc';

const channel = grpc.credentials.createInsecure();

export default {
  PATH: 'protos/apis/nextshop.proto',
  init: (services: any) => ({
    UserService: new services.multiacquirer.UserService('localhost:50051', channel),
    MerchantService: new services.nextshop_core.MerchantService('localhost:50051', channel),
  }),
};
