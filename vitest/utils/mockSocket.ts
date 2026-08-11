import { vi } from 'vitest';

// Phoenix socket mocking for Vitest.
//
// Replaces the transport only — `SocketProvider`, `useSocketChannel` and `useSocketMessage` stay
// real. Channels join successfully, so the queries a page enables from an `onJoin` callback run
// here the way they do in a browser. Server-sent events are not simulated: subscriptions made via
// `channel.on` are accepted and never fire.
//
// Uses `vi.doMock`, which applies only to modules imported AFTER the call — pair it with
// `resetModules` + dynamic imports (checkPrimedRequests.tsx), and clean up with
// `vi.doUnmock('phoenix')`. Mounting under `vitest/lib`'s TestApp additionally requires passing
// `socketUrl={ MOCK_SOCKET_URL }`, since the provider skips socket creation without a url.

/** any non-empty url works — the mocked socket never opens a connection */
export const MOCK_SOCKET_URL = 'wss://localhost/socket';

interface MockPush {
  receive: (status: string, callback: (response: unknown) => void) => MockPush;
}

function createMockPush(): MockPush {
  const push: MockPush = {
    receive: (status, callback) => {
      if (status === 'ok') {
        // a real join never resolves synchronously; keep the callback off the caller's stack so
        // the whole `.receive()` chain is set up before any of it runs
        queueMicrotask(() => callback({}));
      }
      return push;
    },
  };

  return push;
}

function createMockChannel() {
  let nextHandlerRef = 0;

  return {
    join: createMockPush,
    leave: createMockPush,
    push: createMockPush,
    on: () => nextHandlerRef++,
    off: () => {},
  };
}

export function mockSocket() {
  let nextListenerRef = 0;
  const createListenerRef = () => String(nextListenerRef++);

  class MockSocketClass {
    connect() {}
    disconnect() {}
    onOpen = createListenerRef;
    onClose = createListenerRef;
    onError = createListenerRef;
    off() {}
    channel = createMockChannel;
  }

  vi.doMock('phoenix', () => ({ Socket: MockSocketClass }));
}
