import { vi } from 'vitest';

/** any non-empty url works — the mocked socket never opens a connection */
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
