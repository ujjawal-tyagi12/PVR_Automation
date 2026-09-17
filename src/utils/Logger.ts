import { config } from '@config/index';

type Level = 'debug' | 'info' | 'warn' | 'error';

const LEVEL_ORDER: Record<Level, number> = { debug: 0, info: 1, warn: 2, error: 3 };

export class Logger {
  private static shouldLog(level: Level): boolean {
    const configured = (config.logLevel as Level) in LEVEL_ORDER ? (config.logLevel as Level) : 'info';
    return LEVEL_ORDER[level] >= LEVEL_ORDER[configured];
  }

  static debug(message: string, ...meta: unknown[]): void {
    if (this.shouldLog('debug')) console.warn(`[debug] ${message}`, ...meta);
  }

  static info(message: string, ...meta: unknown[]): void {
    if (this.shouldLog('info')) console.warn(`[info] ${message}`, ...meta);
  }

  static warn(message: string, ...meta: unknown[]): void {
    if (this.shouldLog('warn')) console.warn(`[warn] ${message}`, ...meta);
  }

  static error(message: string, ...meta: unknown[]): void {
    if (this.shouldLog('error')) console.error(`[error] ${message}`, ...meta);
  }
}
