import '@testing-library/jest-dom/vitest';
import { vi } from 'vitest';

// Mock global fetch if not present in Node environment
if (!global.fetch) {
  global.fetch = vi.fn();
}

// Mock sessionStorage
const sessionStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: vi.fn((key: string) => store[key] || null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value.toString();
    }),
    removeItem: vi.fn((key: string) => {
      delete store[key];
    }),
    clear: vi.fn(() => {
      store = {};
    }),
  };
})();

if (typeof window !== 'undefined') {
  Object.defineProperty(window, 'sessionStorage', {
    value: sessionStorageMock,
  });
} else {
  (globalThis as any).sessionStorage = sessionStorageMock;
}
