// SPDX-License-Identifier: LicenseRef-Blockscout

import type { AnalyticsProperties, AnalyticsProvider, ProviderInitOptions, TrackOptions } from './provider';
import { getEnabledProviders } from './providers';

type QueuedCall = {
  readonly method: 'track';
  readonly event: string;
  readonly properties: AnalyticsProperties | undefined;
  readonly options: TrackOptions;
} | {
  readonly method: 'peopleSet' | 'peopleSetOnce';
  readonly props: AnalyticsProperties;
} | {
  readonly method: 'reset';
};

export interface ProviderInitEntry {
  readonly provider: AnalyticsProvider;
  readonly options: ProviderInitOptions;
}

// events are user-driven and init takes a few seconds at most, so the cap only guards
// against unbounded growth when an SDK chunk hangs forever
const MAX_QUEUE_LENGTH = 100;

const NO_TRACK_OPTIONS: TrackOptions = {};

let initPromise: Promise<boolean> | undefined;
let liveProviders: ReadonlyArray<AnalyticsProvider> | undefined;
const queue: Array<QueuedCall> = [];

/**
 * The queue is flushed only after `setup` has run on a provider, so super-props and identity
 * apply to the replayed events. A provider whose init or setup throws is dropped for this page
 * load without affecting the others.
 *
 * Idempotent: concurrent and repeated calls share one init. Never rejects — resolves to `false`
 * when no provider could be initialized, which permanently disables the queue for this page load.
 */
export function init(
  providers: ReadonlyArray<ProviderInitEntry>,
  setup: (provider: AnalyticsProvider) => void,
): Promise<boolean> {
  initPromise = initPromise ?? initOnce(providers, setup);
  return initPromise;
}

async function initOnce(
  providers: ReadonlyArray<ProviderInitEntry>,
  setup: (provider: AnalyticsProvider) => void,
): Promise<boolean> {
  const results = await Promise.allSettled(providers.map(async({ provider, options }) => {
    await provider.init(options);
    setup(provider);
    return provider;
  }));

  const initializedProviders = results
    .filter((result) => result.status === 'fulfilled')
    .map((result) => result.value);

  liveProviders = initializedProviders;
  flushQueue(initializedProviders);
  return initializedProviders.length > 0;
}

export function track(
  event: string,
  properties: AnalyticsProperties | undefined,
  options: TrackOptions = NO_TRACK_OPTIONS,
): void {
  dispatch({ method: 'track', event, properties, options });
}

export function peopleSet(props: AnalyticsProperties): void {
  dispatch({ method: 'peopleSet', props });
}

export function peopleSetOnce(props: AnalyticsProperties): void {
  dispatch({ method: 'peopleSetOnce', props });
}

export function reset(): void {
  dispatch({ method: 'reset' });
}

function dispatch(call: QueuedCall): void {
  if (liveProviders) {
    liveProviders.forEach((provider) => callProvider(provider, call));
    return;
  }
  if (queue.length >= MAX_QUEUE_LENGTH || getEnabledProviders().length === 0) {
    return;
  }
  queue.push(call.method === 'track' ? { ...call, options: { ...call.options, timestamp: Date.now() } } : call);
}

function flushQueue(providers: ReadonlyArray<AnalyticsProvider>): void {
  for (const call of queue.splice(0)) {
    providers.forEach((provider) => callProvider(provider, call));
  }
}

function callProvider(provider: AnalyticsProvider, call: QueuedCall): void {
  switch (call.method) {
    case 'track':
      provider.track(call.event, call.properties, call.options);
      break;
    case 'peopleSet':
      provider.peopleSet(call.props);
      break;
    case 'peopleSetOnce':
      provider.peopleSetOnce(call.props);
      break;
    case 'reset':
      provider.reset();
      break;
  }
}
