/* eslint-disable no-param-reassign */
import Gateway from '../src/index';

Gateway.bootstrap(__dirname, async () => {
  /**
   * Before Start Function
   * This is the place to run anythings that application have to(or may be plan to) used
   * such as:
   * - Connect to DB Servers
   * - Load proto files
   * - Load external configs from http endpoint
   * - Etc
   */

  // Demo add a route directly from beforeStart hook
  // Gateway.addRoute(({ Proxy }) => ({
  //   path: '/api',
  //   middlewares: [Proxy.middleware('http://localhost:9999/user')],
  // }));
});
