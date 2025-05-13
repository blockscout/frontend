import dotenv from 'dotenv';
import { TextEncoder, TextDecoder } from 'util';

import fetchMock from 'jest-fetch-mock';

fetchMock.enableMocks();

const envs = dotenv.config({ path: './configs/envs/.env.jest' });

Object.assign(global, { TextDecoder, TextEncoder });

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

Object.defineProperty(window, '__envs', {
  writable: true,
  value: envs.parsed || {},
});

// eslint-disable-next-line no-console
const consoleError = console.error;

global.console = {
  ...console,
  error: (...args) => {
    // silence some irrelevant errors
    if (args.some((arg) => typeof arg === 'string' && arg.includes('Using kebab-case for css properties'))) {
      return;
    }
    consoleError(...args);
  },
};

// Polyfill for structuredClone
if (typeof structuredClone === 'undefined') {
  global.structuredClone = <T>(obj: T): T => {
    try {
      return JSON.parse(JSON.stringify(obj)) as T;
    } catch (error) {
      // Fallback for circular references and other special cases
      return obj;
    }
  };
}
