import { injectable } from 'inversify';

@injectable()
export default class MongoDB {
  connect() {
    console.log('connected to database');
  }
}
