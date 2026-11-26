import { vi } from 'vitest';

// A fake Phoenix transport whose channels join at once, for a component that keeps a query disabled
// until `useSocketChannel` reports a join, or that reacts to live socket messages. Only the `phoenix`
// `Socket` is replaced: `SocketProvider`, `useSocketChannel` and `useSocketMessage` run for real.
//
// It replaces a module, so the spec is an `*.isolated.spec`. A spec that imports the component
// statically installs it with a top-level `vi.mock` and delivers server events itself:
//
//   vi.mock('phoenix', () => import('vitest/utils/mockSocket').then((m) => m.phoenixModule));
//
//   render(<SocketProvider url={ MOCK_SOCKET_URL }><AddressTokenTransfers/></SocketProvider>);
//   act(() => sendSocketMessage('addresses:0x…', 'token_transfer', { token_transfers: [ … ] }));
//
// `mockSocket()` is the `vi.doMock` form, which reaches only modules imported after the call: pair it
// with `vi.resetModules()` and a dynamic import of the component.
//
//   mockSocket();
//   const { default: Token } = await import('./Token');
//   render(<TestApp socketUrl={ MOCK_SOCKET_URL }><Token/></TestApp>);
//   await flushPromises();
//
// Pass the url either way: without one the provider creates no socket at all.

export const MOCK_SOCKET_URL = 'wss://localhost/socket';

type MessageHandler = (payload: unknown) => void;
type ChannelSubscriptions = Map<string, Map<number, MessageHandler>>;

const subscriptionsByTopic = new Map<string, ChannelSubscriptions>();

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

interface MockChannel {
  join: () => MockPush;
  leave: () => MockPush;
  push: () => MockPush;
  on: (event: string, handler: MessageHandler) => number;
  off: (event: string, ref: number) => void;
}

function createMockChannel(topic: string): MockChannel {
  let nextHandlerRef = 0;
  const subscriptions: ChannelSubscriptions = new Map();
  subscriptionsByTopic.set(topic, subscriptions);

  return {
    join: createMockPush,
    leave: () => {
      subscriptionsByTopic.delete(topic);
      return createMockPush();
    },
    push: createMockPush,
    on: (event: string, handler: MessageHandler) => {
      const ref = nextHandlerRef++;
      const handlers = subscriptions.get(event) ?? new Map<number, MessageHandler>();
      handlers.set(ref, handler);
      subscriptions.set(event, handlers);
      return ref;
    },
    off: (event: string, ref: number) => {
      subscriptions.get(event)?.delete(ref);
    },
  };
}

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

export const phoenixModule = { Socket: MockSocketClass };

export function mockSocket() {
  vi.doMock('phoenix', () => phoenixModule);
}

// throws on a topic or event nobody listens to, so a test cannot pass on a message that went nowhere;
// the handlers update React state, so wrap the call in `act`
export function sendSocketMessage(topic: string, event: string, payload: unknown): void {
  const handlers = [ ...(subscriptionsByTopic.get(topic)?.get(event)?.values() ?? []) ];

  if (handlers.length === 0) {
    throw new Error(`No socket subscription for "${ event }" on "${ topic }"`);
  }

  handlers.forEach((handler) => handler(payload));
}
