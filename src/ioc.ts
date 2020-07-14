import 'reflect-metadata';
import { Container } from 'inversify';

// Providers
import Logger from './providers/logger';

const container = new Container();
container.bind('Container').toConstantValue(container);

container.bind('Logger').toConstantValue(Logger);
container.bind('AppLogger').toConstantValue(Logger.createModule('Application'));

export default container;
