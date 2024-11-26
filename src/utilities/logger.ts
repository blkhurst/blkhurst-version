import chalk from "chalk";

const blkhurst = chalk.bgBlack.white.dim("blkhurst");
const errorPrefix = chalk.red("error");
const warnPrefix = chalk.yellow("warning");
const infoPrefix = chalk.green("info");
const debugPrefix = chalk.gray("debug");
const tracePrefix = chalk.dim.gray("trace");

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
    console.error(`${blkhurst}`, `${errorPrefix}`, ...args);
  };
  warn: LogFn = (...args: any[]) => {
    console.warn(`${blkhurst}`, `${warnPrefix}`, ...args);
  };
  info: LogFn = (...args: any[]) => {
    console.info(`${blkhurst}`, `${infoPrefix}`, ...args);
  };
  debug: LogFn = (...args: any[]) => {
    if (this.includeDebug) console.debug(`${blkhurst}`, `${debugPrefix}`, ...args);
  };
  trace: LogFn = (...args: any[]) => {
    if (this.includeTrace) console.debug(`${blkhurst}`, `${tracePrefix}`, ...args);
  };
}

export let logger: Logger = new CheckpointLogger(true, true);

export function setLogger(userLogger: Logger) {
  logger = userLogger;
}
