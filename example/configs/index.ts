export const host = '0.0.0.0';

export const port = <number><unknown>process.env.PORT || 80;

export const providers: { [name: string]: string } = {
  'App/MongoDB': '@app/providers/mongodb',
};

export { default as grpc } from './grpc';
export * as routes from '../routes';
export { default as databases } from './databases';
