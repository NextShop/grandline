import RouteConfigs from '../configs/route';
import GatewayHandler from './gateway_hander';

export type RouteConfigFunction = (args: { [name: string]: GatewayHandler }) => RouteConfigs;
