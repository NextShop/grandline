/* eslint-disable no-restricted-syntax */
import { Container } from 'inversify';
import winston from 'winston';
import { isObject } from 'util';
import GLHandler from './interfaces/utils/grandline_hander';
import container from './ioc';
import Config from './providers/config';
import ExpressProvider from './providers/express';
import { RouteConfigFunction } from './interfaces/utils/route_config';
import Logger from './providers/logger';
import GLRouter from './interfaces/utils/grandline_router';

const coreProviders: any = {
  Express: '@core/providers/express',
  Router: '@core/providers/router',
  gRPC: { path: '@core/providers/grpc', scope: 'singleton' },
  HttpProxy: '@core/providers/http_proxy',
};

const coreHandlers: any = {
  gRPC: '@core/handlers/grpc',
  Proxy: '@core/handlers/http_proxy',
};

class GrandLine {
  private ioc: Container;

  private APP_ROOT: string;

  private handlers: {[name: string]: GLHandler} = {};

  private logger: winston.Logger = Logger.createModule('GRANDLINE');

  constructor(iocContainer: Container) {
    this.ioc = iocContainer;
  }

  async bootstrap(APP_ROOT: string, beforeStart?: () => Promise<void>) {
    this.APP_ROOT = APP_ROOT;
    this.ioc.bind('APP_ROOT').toConstantValue(APP_ROOT);

    // Load configs
    await this._resolveConfig();

    // Import all dependencies
    await this._registerProviders({
      ...coreProviders,
      ...this.ioc.get<Config>('Config').get('providers'),
    });

    // Import handlers
    await this._registerHandlers({
      ...coreHandlers,
      ...this.ioc.get<Config>('Config').get('handlers'),
    });

    // Import controllers
    await this._resgisterControllers(this.config('controllers'));

    // Import routers
    const routes: string[] = await this._registerRoutes(this.config('routes'));

    // Start express server
    const express = this.make<ExpressProvider>('Express');
    routes.forEach((routeName) => express.add(this.make<GLRouter>(routeName)));

    if(beforeStart) await beforeStart();

    express.listen(this.config('port'));
  }

  _resolvePath(filePath: string) {
    return filePath.replace('@core/', './').replace('@/', `${this.APP_ROOT}/`);
  }

  async _resolveConfig() {
    this.ioc.bind('Config').to(Config).inSingletonScope();
    await this.ioc.get<Config>('Config').load();
    this.config('APP_ROOT', this.APP_ROOT);
  }

  async _bind(service: string, file: string, suffix?: string) {
    const { default: ServiceClass } = await import(file);

    const [namespace, coreServiceName] = service.split('/').length === 2
      ? service.split('/')
      : [null, service];

    const sName = (!namespace && namespace === 'GrandLine') ? coreServiceName : service;
    const sSuffix = suffix || '';

    this.ioc.bind(`${sName}${sName.endsWith(sSuffix) ? '' : sSuffix}`).to(ServiceClass);
  }

  async _bindSingleton(service: string, file: string, suffix?: string) {
    const { default: ServiceClass } = await import(file);

    const [namespace, coreServiceName] = service.split('/').length === 2
      ? service.split('/')
      : [null, service];

    const sName = (!namespace && namespace === 'GrandLine') ? coreServiceName : service;
    const sSuffix = suffix || '';

    this.ioc.bind(`${sName}${sName.endsWith(sSuffix) ? '' : sSuffix}`).to(ServiceClass).inSingletonScope();
  }

  async _registerProviders(providers: {[name: string]: string | {path: string, scope?: 'normal' | 'singleton'}}) {
    for (const providerName of Object.keys(providers)) {
      if(isObject(providers[providerName])) {
        const provider = <{path: string, scope?: 'normal' | 'singleton'}>providers[providerName];
        const file = this._resolvePath(provider.path);

        if(!provider.scope || provider.scope === 'normal') {
          this._bind(providerName, file);
        } else {
          this._bindSingleton(providerName, file);
        }
      } else {
        const file = this._resolvePath(<string>providers[providerName]);
        await this._bind(providerName, file);
      }
    }
  }

  async _registerHandlers(handlers: {[name: string]: string}) {
    for (const handlerKey of Object.keys(handlers)) {
      const file = this._resolvePath(<string>handlers[handlerKey]);

      await this._bind(handlerKey, file, 'Handler');
      this.handlers[handlerKey] = this.ioc.get<GLHandler>(`${handlerKey}Handler`);
    }
  }

  async _resgisterControllers(controllers: {[name: string]: string}) {
    if(controllers) {
      for (const controllerKey of Object.keys(controllers)) {
        const file = this._resolvePath(<string>controllers[controllerKey]);
        await this._bind(`${controllerKey}`, file, 'Controller');
      }
    }
  }

  async _registerRoutes(routes: {[name: string]: any}) {
    const bindedRoutes = [];
    if(routes) {
      for (const routeKey of Object.keys(routes)) {
        const file = this._resolvePath(<string>routes[routeKey]);
        await this._bind(`${routeKey}`, file, 'Route');

        bindedRoutes.push(`${routeKey}${routeKey.endsWith('Route') ? '' : 'Route'}`);
      }
    }

    return bindedRoutes;
  }

  get<T>(serviceName: string) {
    return this.ioc.get<T>(serviceName);
  }

  make<T>(serviceName: string) {
    return this.ioc.get<T>(serviceName);
  }

  config(name: string, value?: any) {
    if(value) this.ioc.get<Config>('Config').set(name, value);
    return this.ioc.get<Config>('Config').get(name);
  }

  async addHandler(name: string, handlerPath: string) {
    const { default: HandlerClass } = await import(`${this.ioc.get('APP_ROOT')}/${handlerPath}`);
    this.ioc.bind(`Handler/${name}`).to(HandlerClass);

    this.config('handlers')[name] = this.ioc.get(`Handler/${name}`);
  }

  addRoute(routeConfigFn : RouteConfigFunction) {
    this.make<Config>('Config')
      .get('Express')
      .add(routeConfigFn, this.config('handlers'));
  }
}

export default new GrandLine(container);
