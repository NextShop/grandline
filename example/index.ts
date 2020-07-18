import GrandLine, { ExpressProvider } from '../src/index';
import GrpcProvider from '../src/providers/grpc';

GrandLine.bootstrap(__dirname, async (express: ExpressProvider) => {
  /**
   * Before Start Function
   * This is the place to run anythings that application have to(or may be you plan to) use
   * such as:
   * - Connect to DB Servers
   * - Load proto files
   * - Load external configs from http endpoint
   * - Dynamically register a handler/provider
   * - Load grpc proto files
   * - Etc
   */

  await GrandLine.make<GrpcProvider>('gRPC')
    .loadProtos(GrandLine.config('grpc').PATH, GrandLine.config('grpc').init);

  express.listen(GrandLine.config('port'));
});
