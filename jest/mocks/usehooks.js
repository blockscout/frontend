module.exports = {
  useClickAway: jest.fn(() => jest.fn()),
  useEventListener: jest.fn(),
  useLocalStorage: jest.fn(() => [ '', jest.fn() ]),
  useSessionStorage: jest.fn(() => [ '', jest.fn() ]),
  useToggle: jest.fn(() => [ false, jest.fn() ]),
  useDebounce: jest.fn((value) => value),
  useThrottle: jest.fn((value) => value),
  usePrevious: jest.fn(),
  useCounter: jest.fn(() => ({ count: 0, increment: jest.fn(), decrement: jest.fn(), reset: jest.fn() })),
  useCopyToClipboard: jest.fn(() => [ '', jest.fn() ]),
};
