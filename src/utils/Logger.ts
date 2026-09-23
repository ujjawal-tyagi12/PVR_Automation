import { config } from '@config/index';

type Level = 'debug' | 'info' | 'warn' | 'error';

const LEVEL_WEIGHT: Record<Level, number> = { debug: 0, info: 1, warn: 2, error: 3 };

function shouldLog(level: Level): boolean {
  const configured = (config.logLevel as Level) in LEVEL_WEIGHT ? (config.logLevel as Level) : 'info';
  return LEVEL_WEIGHT[level] >= LEVEL_WEIGHT[configured];
}

function write(level: Level, message: string, meta?: unknown): void {
  if (!shouldLog(level)) return;
  const line = `[${new Date().toISOString()}] [${level.toUpperCase()}] ${message}`;
  const out = level === 'error' ? process.stderr : process.stdout;
  out.write(meta === undefined ? `${line}\n` : `${line} ${JSON.stringify(meta)}\n`);
}

export const Logger = {
  debug: (message: string, meta?: unknown): void => write('debug', message, meta),
  info: (message: string, meta?: unknown): void => write('info', message, meta),
  warn: (message: string, meta?: unknown): void => write('warn', message, meta),
  error: (message: string, meta?: unknown): void => write('error', message, meta),
};
