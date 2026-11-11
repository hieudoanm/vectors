import { afterEach, describe, expect, it, vi } from 'vitest';
import { log } from '@/lib/log';

afterEach(() => {
  vi.restoreAllMocks();
});

describe('log', () => {
  it('writes formatted messages with the level tag', () => {
    const spy = vi.spyOn(console, 'log').mockImplementation(() => {});
    log.info('hello', 42);
    expect(spy).toHaveBeenCalledOnce();
    const output = spy.mock.calls[0][0] as string;
    expect(output).toContain('[INFO]');
    expect(output).toContain('hello');
    expect(output).toContain('42');
  });
});
