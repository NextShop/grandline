import RouteConfigs from '../configs/route';
import GLHandler from './grandline_hander';

export type RouteConfigFunction = (args: { [name: string]: GLHandler }) => RouteConfigs;
