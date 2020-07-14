import { injectable, inject } from 'inversify';

@injectable()
export default class Config {
  private configs: any = {};

  @inject('APP_ROOT') private appRoot: string;

  async load() {
    this.configs = await import(`${this.appRoot}/configs`);
  }

  get(name: string) {
    return this.configs[name];
  }

  set(name: string, value: any) {
    this.configs[name] = value;
    return this.configs[name];
  }
}
