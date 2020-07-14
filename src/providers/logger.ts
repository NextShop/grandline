import winston, {
  format, transports,
} from 'winston';
import { SPLAT } from 'triple-beam';
import { isObject, trimEnd } from 'lodash';
import chalk from 'chalk';
import stringify from 'json-stringify-safe';
import { injectable } from 'inversify';

const {
  combine, timestamp, colorize, label, printf, align, errors,
} = format;

function formatObject(param: any) {
  if (param && param.stack) {
    if (param.ctx && param.type) {
      return stringify({
        code: param.code, type: param.type, data: param.data,
      }, null, 2);
    }
    return stringify(param);
  }
  if (isObject(param)) {
    return stringify(param, null, 2);
  }
  return param;
}

const all = format((info) => {
  const splat = info[SPLAT] || [];

  const isSplatTypeMessage = typeof info.message === 'string'
    && (info.message.includes('%s') || info.message.includes('%d') || info.message.includes('%j'));
  if (isSplatTypeMessage) {
    return info;
  }
  let message = formatObject(info.message);
  const rest = splat
    .map(formatObject)
    .join(' ');
  message = trimEnd(`${message} ${rest}`);
  return { ...info, message };
});

@injectable()
export default class Logger {
  static createModule(logModule: string) {
    const logger = winston.createLogger({
      format: combine(
        errors({ stack: true }),
        format((info) => ({ ...info, level: info.level.toUpperCase() }))(),
        colorize(),
        all(),
        label({ label: 'version' }),
        timestamp(),
        align(),
        printf((info) => `[${info.timestamp}] ${info.level}  ${chalk.blue(logModule.toUpperCase())}: ${info.message} ${info.stack ? (`\n${info.stack}`) : ''}`),
      ),
      transports: [new transports.Console()],
    });

    return logger;
  }
}
