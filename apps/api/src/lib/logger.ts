import chalk from 'chalk';
import symbols from 'log-symbols';

const timestamp = () => chalk.gray(new Date().toISOString());

const formatLine = (typeLabel: string, typeColor: any, symbol: string, source: string, message: string) => {
  const type = typeColor(`[${typeLabel}]`);
  const src = chalk.cyan(`[${source}]`);
  return `${timestamp()} ${symbol} ${type} ${src} ${message}`;
};

export const info = (msg: string, source = 'app') => {
  console.log(formatLine('INFO', chalk.blue, symbols.info, source, chalk.blueBright(msg)));
};

export const success = (msg: string, source = 'app') => {
  console.log(formatLine('SUCCESS', chalk.green, symbols.success, source, chalk.green(msg)));
};

export const warn = (msg: string, source = 'app') => {
  console.log(formatLine('WARN', chalk.hex('#FFA500'), symbols.warning, source, chalk.yellow(msg)));
};

export const error = (msg: string, source = 'app') => {
  console.error(formatLine('ERROR', chalk.red, symbols.error, source, chalk.redBright(msg)));
};

export const debug = (msg: string, source = 'app') => {
  if (process.env.DEBUG) {
    console.log(formatLine('DEBUG', chalk.magenta, '🐛', source, chalk.magentaBright(msg)));
  }
};

export const createLogger = (source: string) => ({
  info: (m: string) => info(m, source),
  success: (m: string) => success(m, source),
  warn: (m: string) => warn(m, source),
  error: (m: string) => error(m, source),
  debug: (m: string) => debug(m, source),
});

export default { info, success, warn, error, debug, createLogger };
