// Minimal chrome.* stub: captures addListener callbacks per event key and
// exposes vi.fn()s for the APIs the extension calls. Install with
// `globalThis.chrome = chromeMock` before importing a module under test.

import { vi } from 'vitest';

type Handler = (...args: unknown[]) => unknown;

const registry = new Map<string, Handler[]>();

const on = (key: string) => ({
  addListener: (cb: Handler) => {
    registry.set(key, [...(registry.get(key) ?? []), cb]);
  },
});

/** Invoke every listener registered for `key`, in registration order. */
export const fire = async (key: string, ...args: unknown[]): Promise<void> => {
  for (const cb of registry.get(key) ?? []) {
    await cb(...args);
  }
};

export const listeners = (key: string): Handler[] => registry.get(key) ?? [];

export const resetChrome = (): void => {
  vi.clearAllMocks();
};

export const chromeMock = {
  runtime: {
    onInstalled: on('installed'),
    onMessage: on('runtimeMessage'),
    sendMessage: vi.fn(),
  },
  contextMenus: {
    create: vi.fn(),
    onClicked: on('menuClicked'),
  },
  offscreen: {
    hasDocument: vi.fn(async () => false),
    createDocument: vi.fn(async () => undefined),
  },
  downloads: {
    download: vi.fn(async () => 1),
  },
  notifications: {
    create: vi.fn(),
  },
};

export const installChrome = (): void => {
  (globalThis as { chrome?: unknown }).chrome = chromeMock;
};
