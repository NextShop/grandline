import { Container } from 'inversify';

export default interface ProviderConfigs {
  register: (container: Container) => any
}
