import chalk from "chalk";
import figures, { mainSymbols, fallbackSymbols, replaceSymbols } from "figures";

const errorPrefix = chalk.red(figures.cross);
const warnPrefix = chalk.yellow(figures.warning);
const infoPrefix = chalk.green(figures.tick);
const debugPrefix = chalk.gray(figures.pointer);
const tracePrefix = chalk.dim.gray(figures.pointerSmall);

interface LogFn {
  <T extends object>(obj: T, msg?: string, ...args: any[]): void;
  (msg: string, ...args: any[]): void;
}

export interface Logger {
  error: LogFn;
  warn: LogFn;
  info: LogFn;
  debug: LogFn;
  trace: LogFn;
}

export class CheckpointLogger implements Logger {
  private includeDebug: boolean;
  private includeTrace: boolean;
  constructor(includeDebug = false, includeTrace = false) {
    this.includeDebug = includeDebug;
    this.includeTrace = includeTrace;
  }
  error: LogFn = (...args: any[]) => {
    console.error(`${errorPrefix}`, ...args);
  };
  warn: LogFn = (...args: any[]) => {
    console.warn(`${warnPrefix}`, ...args);
  };
  info: LogFn = (...args: any[]) => {
    console.info(`${infoPrefix}`, ...args);
  };
  debug: LogFn = (...args: any[]) => {
    if (this.includeDebug) console.debug(`${debugPrefix}`, ...args);
  };
  trace: LogFn = (...args: any[]) => {
    if (this.includeTrace) console.debug(`${tracePrefix}`, ...args);
  };
}

export let logger: Logger = new CheckpointLogger(true, true);

export function setLogger(userLogger: Logger) {
  logger = userLogger;
}
