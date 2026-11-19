import { afterEach, describe, expect, it, vi } from 'vitest';
import { log } from '../log.js';

describe('log', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it.each(['debug', 'info', 'warn', 'error'] as const)(
    '%s writes a bracketed Vectors/level/timestamp prefix',
    (level) => {
      const fn = vi.spyOn(console, level).mockImplementation(() => {});
      log[level]('hello', 42);

      expect(fn).toHaveBeenCalledOnce();
      const [format, ...rest] = fn.mock.calls[0] as unknown[];
      expect(format).toBe('%c[Vectors]%c %c[%s]%c %c[%s]%c');
      // [brand color] [level color] LEVEL [reset] [dim] timestamp [reset] ...args
      expect(rest[3]).toBe(level.toUpperCase());
      expect(rest[6]).toMatch(/^\d{4}-\d{2}-\d{2}T/);
      expect(rest.slice(8)).toEqual(['hello', 42]);
    }
  );
});
