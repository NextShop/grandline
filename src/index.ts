/* eslint-disable max-classes-per-file */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
import container from './ioc';
import Config from './providers/config';
import ExpressProvider from './providers/express';
import { RouteConfigFunction } from './interfaces/utils/route_config';

async function _bind(namespace: string, provider: string, file?: string) {
  const { default: ProviderClass } = await import(`${file}`);

  if (namespace === 'Gateway') container.bind(provider).to(ProviderClass);
  if (namespace === 'App') container.bind(`${namespace}/${provider}`).to(ProviderClass);
}

async function _resolveDependencies(
  APP_ROOT: string,
  providers: {[name: string]: string},
) {
  for (const providerPath of Object.keys(providers)) {
    const [namespace, provider] = providerPath.split('/');
    const file = <string>providers[providerPath];

    await _bind(namespace, provider, file.replace('@core', '.').replace('@app', APP_ROOT));
  }
}

async function _registerHandlers(APP_ROOT: string, handlers: {[name: string]: string}) {
  const handlersConfig = container.get<Config>('Config').set('handlers', {});
  for (const handlerPath of Object.keys(handlers)) {
    const handler = handlerPath.split('/').length === 2
      ? handlerPath.split('/')[1]
      : handlerPath;
    const file = <string>handlers[handlerPath];

    await _bind('Gateway', handler, file.replace('@core', '.').replace('@app', APP_ROOT));

    handlersConfig[handler.replace(/Handler$/g, '')] = container.get(handler);
  }
}

async function _resolveConfig(APP_ROOT: string) {
  container.bind('Config').to(Config).inSingletonScope();
  await container.get<Config>('Config').load();

  container.get<Config>('Config').set('APP_ROOT', APP_ROOT);
}

export default class Gateway {
  static async bootstrap(
    APP_ROOT: string,
    beforeStart?: () => Promise<void>,
  ) {
    container.bind('APP_ROOT').toConstantValue(APP_ROOT);

    // Load configs
    await _resolveConfig(APP_ROOT);

    // Import all dependencies
    const providers: any = {
      'Gateway/Express': '@core/providers/express',
      'Gateway/Router': '@core/providers/router',
      'Gateway/gRPC': '@core/providers/grpc',
      'Gateway/HttpProxy': '@core/providers/http_proxy',
      ...container.get<Config>('Config').get('providers'),
    };
    await _resolveDependencies(APP_ROOT, providers);

    // Import handlers
    const handlers: any = {
      ExpressHandler: '@core/handlers/express',
      gRPCHandler: '@core/handlers/grpc',
      ProxyHandler: '@core/handlers/http_proxy',
      ...container.get<Config>('Config').get('handlers'),
    };
    await _registerHandlers(APP_ROOT, handlers);

    const express = container.get<ExpressProvider>('Express');
    container.get<Config>('Config').set('Express', express);
    const routes: {[name: string]: RouteConfigFunction} = Gateway.config('routes');

    Object.keys(routes).forEach((routeModule: string) => {
      express.add(routes[routeModule], container.get<Config>('Config').get('handlers'));
    });

    if(beforeStart) await beforeStart();

    express.listen(Gateway.config('port'));
  }

  static get<T>(serviceName: string) {
    return container.get<T>(serviceName);
  }

  static make<T>(serviceName: string) {
    return container.get<T>(serviceName);
  }

  static config(name: string) {
    return container.get<Config>('Config').get(name);
  }

  static async addHandler(name: string, handlerPath: string) {
    const { default: HandlerClass } = await import(`${container.get('APP_ROOT')}/${handlerPath}`);
    container.bind(`Handler/${name}`).to(HandlerClass);

    Gateway.config('handlers')[name] = container.get(`Handler/${name}`);
  }

  static async addRoute(routeConfigFn : RouteConfigFunction) {
    Gateway.make<Config>('Config')
      .get('Express')
      .add(routeConfigFn, Gateway.config('handlers'));
  }
}

export { default as ApplicationConfigs } from './interfaces/configs/application';
export { default as RouteConfigs } from './interfaces/configs/route';
export { default as EndpointConfigs } from './interfaces/configs/endpoint';
export { default as MiddlewareConfigs } from './interfaces/configs/middleware';
export { default as ProviderConfigs } from './interfaces/configs/provider';

export { RouteConfigFunction } from './interfaces/utils/route_config';
export { default as GatewayHandler } from './interfaces/utils/gateway_hander';

// Providers
export { default as LogProvider } from './providers/logger';
export { default as ExpressProvider } from './providers/express';
export { default as RouterProvider } from './providers/router';
export { default as ConfigProvider } from './providers/config';
