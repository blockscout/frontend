// SPDX-License-Identifier: LicenseRef-Blockscout

import type { Config, Dict, Mixpanel } from 'mixpanel-browser';

import config from 'src/config';

import { SECOND } from 'src/toolkit/utils/consts';

type TrackFnArgs = Parameters<Mixpanel['track']>;

type QueuedCall = {
  method: 'track';
  args: TrackFnArgs;
  timestamp: number;
} | {
  method: 'people.set' | 'people.set_once' | 'people.increment';
  props: Dict;
} | {
  method: 'reset';
};

// events are user-driven and init takes a few seconds at most, so the cap only guards
// against unbounded growth when the SDK chunk hangs forever
const MAX_QUEUE_LENGTH = 100;

let instance: Mixpanel | undefined;
let initPromise: Promise<boolean> | undefined;
let hasInitFailed = false;
const queue: Array<QueuedCall> = [];

function isEnabled(): boolean {
  return Boolean(config.services.mixpanel.projectToken) && !hasInitFailed;
}

function enqueue(call: QueuedCall) {
  if (queue.length >= MAX_QUEUE_LENGTH) {
    return;
  }
  queue.push(call);
}

/**
 * Loads the SDK chunk, initializes it and replays every call buffered while it was loading.
 * The queue is flushed only after `setup` has run, so super-props (`register`) and identity
 * (`identify`) apply to the replayed events.
 *
 * Idempotent: concurrent and repeated calls share one SDK init. Never rejects — a chunk-load
 * failure resolves to `false` and permanently disables the wrapper for this page load.
 */
export function init(
  projectToken: string,
  mixpanelConfig: Partial<Config>,
  setup: (mixpanel: Mixpanel) => void,
): Promise<boolean> {
  initPromise = initPromise ?? initOnce(projectToken, mixpanelConfig, setup);
  return initPromise;
}

async function initOnce(
  projectToken: string,
  mixpanelConfig: Partial<Config>,
  setup: (mixpanel: Mixpanel) => void,
): Promise<boolean> {
  try {
    const mixpanel = (await import('mixpanel-browser')).default;
    mixpanel.init(projectToken, mixpanelConfig);
    setup(mixpanel);
    instance = mixpanel;
  } catch {
    hasInitFailed = true;
    queue.splice(0);
    return false;
  }
  flushQueue(instance);
  return true;
}

export function track(...args: TrackFnArgs): void {
  if (!isEnabled()) {
    return;
  }
  if (instance) {
    instance.track(...args);
    return;
  }
  enqueue({ method: 'track', args, timestamp: Date.now() });
}

export function peopleSet(props: Dict): void {
  if (!isEnabled()) {
    return;
  }
  if (instance) {
    instance.people.set(props);
    return;
  }
  enqueue({ method: 'people.set', props });
}

export function peopleSetOnce(props: Dict): void {
  if (!isEnabled()) {
    return;
  }
  if (instance) {
    instance.people.set_once(props);
    return;
  }
  enqueue({ method: 'people.set_once', props });
}

export function peopleIncrement(props: Dict): void {
  if (!isEnabled()) {
    return;
  }
  if (instance) {
    instance.people.increment(props);
    return;
  }
  enqueue({ method: 'people.increment', props });
}

export function reset(): void {
  if (!isEnabled()) {
    return;
  }
  if (instance) {
    instance.reset();
    return;
  }
  enqueue({ method: 'reset' });
}

function flushQueue(mixpanel: Mixpanel) {
  for (const call of queue.splice(0)) {
    switch (call.method) {
      case 'track': {
        const [ eventName, properties, optionsOrCallback, callback ] = call.args;
        // `time` (epoch seconds) backdates the replayed event to when it was actually fired
        mixpanel.track(eventName, { time: call.timestamp / SECOND, ...properties }, optionsOrCallback, callback);
        break;
      }
      case 'people.set':
        mixpanel.people.set(call.props);
        break;
      case 'people.set_once':
        mixpanel.people.set_once(call.props);
        break;
      case 'people.increment':
        mixpanel.people.increment(call.props);
        break;
      case 'reset':
        mixpanel.reset();
        break;
    }
  }
}
