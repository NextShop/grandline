export const host = '0.0.0.0';

export const port = <number><unknown>process.env.PORT || 80;

export const providers: { [name: string]: string } = {
  'App/MongoDB': '@/providers/mongodb',
};

export const controllers: { [name: string]: string } = {
  User: '@/controllers/user',
};

export const routes: { [name: string]: string } = {
  UserRoute: '@/routes/user',
  APIRoute: '@/routes/api',
};

export { default as grpc } from './grpc';
export { default as databases } from './databases';
