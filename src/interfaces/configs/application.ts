import ProviderConfigs from './provider';
import RouteConfigs from './route';
import MiddlewareConfigs from './middleware';

export default interface ApplicationConfigs {
  host?: string
  port?: number

  providers?: ProviderConfigs[]

  middlewares?: MiddlewareConfigs[]
  routes?: RouteConfigs[]
}
