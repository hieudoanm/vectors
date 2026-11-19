// Tiny extension logger: ISO timestamp, level, ANSI-free %c colors for
// devtools. Safe in service workers, offscreen documents and background
// pages — it only wraps console.*.

type Level = 'debug' | 'info' | 'warn' | 'error';

const COLORS: Record<Level, string> = {
  debug: 'color:#8b93a3',
  info: 'color:#3b82f6;font-weight:600',
  warn: 'color:#d97706;font-weight:600',
  error: 'color:#dc2626;font-weight:600',
};

const BRAND = 'color:#3b82f6;font-weight:700';
const DIM = 'color:#8b93a3';

const stamp = (): string => new Date().toISOString();

const write = (level: Level, args: unknown[]): void => {
  const fn =
    level === 'debug'
      ? console.debug
      : level === 'info'
        ? console.info
        : level === 'warn'
          ? console.warn
          : console.error;
  fn(
    `%c[Vectors]%c %c[%s]%c %c[%s]%c`,
    BRAND,
    '',
    COLORS[level],
    level.toUpperCase(),
    '',
    DIM,
    stamp(),
    '',
    ...args
  );
};

export const log = {
  debug: (...args: unknown[]) => write('debug', args),
  info: (...args: unknown[]) => write('info', args),
  warn: (...args: unknown[]) => write('warn', args),
  error: (...args: unknown[]) => write('error', args),
};
