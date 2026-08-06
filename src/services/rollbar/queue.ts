// SPDX-License-Identifier: LicenseRef-Blockscout

import type Rollbar from 'rollbar';

import config from 'src/config';

import { SECOND } from 'src/toolkit/utils/consts';

type LogLevel = 'warn' | 'error' | 'critical';

interface QueuedCall {
  level: LogLevel;
  args: Array<Rollbar.LogArgument>;
  timestamp: number;
};

/** Subset of the Rollbar instance call sites use; return value is unused so we omit `LogResult`. */
export interface RollbarClient {
  warn: (...args: Array<Rollbar.LogArgument>) => void;
  error: (...args: Array<Rollbar.LogArgument>) => void;
  critical: (...args: Array<Rollbar.LogArgument>) => void;
};

// reports are rare and init takes a few seconds at most; the cap only guards against unbounded
// growth when the SDK chunk hangs forever
const MAX_QUEUE_LENGTH = 100;

// upper bound for the idle-callback deferral, so init is not postponed indefinitely on busy pages
const IDLE_INIT_TIMEOUT = 2 * SECOND;

let instance: Rollbar | undefined;
let initPromise: Promise<boolean> | undefined;
let hasInitFailed = false;
let earlyListenersInstalled = false;
let uninstallEarlyListeners: (() => void) | undefined;
const queue: Array<QueuedCall> = [];

const client: RollbarClient = {
  warn: (...args) => log('warn', args),
  error: (...args) => log('error', args),
  critical: (...args) => log('critical', args),
};

function isEnabled(): boolean {
  return Boolean(config.services.rollbar.clientToken) && !hasInitFailed;
}

/**
 * Returns the buffering client when Rollbar is configured, else `undefined` — same contract the
 * previous `@rollbar/react` + `FallbackProvider` split gave call sites.
 */
export function getClient(): RollbarClient | undefined {
  return isEnabled() ? client : undefined;
}

function enqueue(call: QueuedCall) {
  if (queue.length >= MAX_QUEUE_LENGTH) {
    return;
  }
  queue.push(call);
}

function log(level: LogLevel, args: Array<Rollbar.LogArgument>): void {
  if (!isEnabled()) {
    return;
  }
  if (instance) {
    instance[level](...args);
    return;
  }
  enqueue({ level, args, timestamp: Date.now() });
}

/**
 * Loads the SDK chunk, constructs the instance, and replays every call buffered while it was
 * loading. Idempotent: concurrent and repeated calls share one init. Never rejects — a chunk-load
 * failure resolves to `false` and permanently disables the wrapper for this page load.
 */
export function init(): Promise<boolean> {
  initPromise = initPromise ?? initOnce();
  return initPromise;
}

async function initOnce(): Promise<boolean> {
  const accessToken = config.services.rollbar.clientToken;
  if (!accessToken) {
    return false;
  }

  try {
    const [ { 'default': Rollbar }, { buildClientConfig } ] = await Promise.all([
      import('rollbar'),
      import('./clientConfig'),
    ]);
    instance = new Rollbar(buildClientConfig(accessToken));
  } catch {
    hasInitFailed = true;
    queue.splice(0);
    uninstallEarlyListeners?.();
    return false;
  }

  flushQueue(instance);
  return true;
}

function flushQueue(rollbar: Rollbar) {
  for (const call of queue.splice(0)) {
    // Rollbar's occurrence timestamp is server receipt time; attach the original call time so
    // buffered reports stay attributable in the custom payload
    rollbar[call.level](...withClientTimestamp(call.args, call.timestamp));
  }
}

function withClientTimestamp(args: Array<Rollbar.LogArgument>, timestamp: number): Array<Rollbar.LogArgument> {
  // Unix seconds (not ms) — Rollbar's own timestamps are second-granularity; keep the custom
  // field on the same scale so queries don't mix units with Mixpanel's ms `time` property
  const clientTimestamp = timestamp / SECOND;
  const customIndex = args.findIndex((arg) => (
    arg !== null &&
    typeof arg === 'object' &&
    !(arg instanceof Error) &&
    typeof arg !== 'function'
  ));

  if (customIndex === -1) {
    return [ ...args, { client_timestamp: clientTimestamp } ];
  }

  const existing = args[customIndex] as Record<string, unknown>;
  const next = [ ...args ];
  next[customIndex] = { client_timestamp: clientTimestamp, ...existing };
  return next;
}

const UNCAUGHT_ERROR_FALLBACK_MESSAGE = 'Uncaught error';

/**
 * Coerces a thrown value into arguments Rollbar can build an occurrence from. Passed a bare
 * non-Error object (or `null`) as its sole argument, Rollbar discards the payload and files a
 * generic "Item sent with null or missing arguments." occurrence — so anything that is not an
 * `Error` or `string` is reported under {@link UNCAUGHT_ERROR_FALLBACK_MESSAGE} with the raw value
 * preserved as custom data.
 */
function toReport(value: unknown, message: string): Array<Rollbar.LogArgument> {
  if (value instanceof Error || typeof value === 'string') {
    return [ value ];
  }
  if (value === null || value === undefined) {
    return [ message || UNCAUGHT_ERROR_FALLBACK_MESSAGE ];
  }
  return [ message || UNCAUGHT_ERROR_FALLBACK_MESSAGE, { error: value } ];
}

/**
 * Captures uncaught errors during (and after) the SDK deferral window. Kept for the page lifetime
 * on success — removed if init fails. Rollbar's own `captureUncaught` stays off to avoid
 * double-reporting; `captureUnhandledRejections` is left off deliberately — on public instances
 * unhandled rejections are dominated by wallet-extension / third-party noise with no usable
 * payload (they file empty "null or missing arguments" items), and genuine page crashes surface as
 * `critical` through the React error boundary, not here.
 */
export function installEarlyListeners(): () => void {
  if (!isEnabled() || earlyListenersInstalled || typeof window === 'undefined') {
    return () => {};
  }

  earlyListenersInstalled = true;

  const handleError = (event: ErrorEvent) => {
    // Resource load failures (img/script/link) target the element, not window, and are invisible
    // to Rollbar's `window.onerror` capture — skip them so we don't burn `maxItems` on noise.
    // Listener is capture-phase so those events are observable here at all (they do not bubble).
    if (event.target instanceof Element) {
      return;
    }
    log('error', toReport(event.error, event.message));
  };

  window.addEventListener('error', handleError, true);

  const uninstall = () => {
    window.removeEventListener('error', handleError, true);
    earlyListenersInstalled = false;
    if (uninstallEarlyListeners === uninstall) {
      uninstallEarlyListeners = undefined;
    }
  };

  uninstallEarlyListeners = uninstall;
  return uninstall;
}

/** Schedules `init` after first paint / on idle. Returns a cancel function. */
export function scheduleInit(): () => void {
  if (!isEnabled()) {
    return () => {};
  }

  const startInit = () => {
    void init();
  };

  if (typeof window.requestIdleCallback === 'function') {
    const idleCallbackId = window.requestIdleCallback(startInit, { timeout: IDLE_INIT_TIMEOUT });
    return () => window.cancelIdleCallback(idleCallbackId);
  }

  const timeoutId = window.setTimeout(startInit, 0);
  return () => window.clearTimeout(timeoutId);
}
