// SPDX-License-Identifier: LicenseRef-Blockscout

// PROTOTYPE — throwaway, lives only on branch `prototype/3697-page-transition`.
// Question: what should the page-transition state look like (#3697 T13, Q01)?
// Plan: three variants of the dimmed-rows state plus today's skeleton pass, switchable via `?variant=`
// on every paginated list (reference: address Transactions tab, /txs, /blocks). `?latency=` adds a fake
// request delay so the state stays on screen long enough to judge.

import React from 'react';

export const VARIANTS = [
  { key: 'dim', name: 'Dimmed rows', spec: 'rows opacity 0.4, 150ms fade; header and sorting stay active' },
  { key: 'progress', name: 'Header progress bar', spec: 'rows full opacity but inert; loader bar under the sticky header' },
  { key: 'overlay', name: 'Blur + loading pill', spec: 'rows opacity 0.5 and blurred; sticky "Loading page" pill' },
  { key: 'skeleton', name: 'Today: skeleton pass', spec: 'current behaviour; stub rows on every page change' },
] as const;

export type VariantKey = typeof VARIANTS[number]['key'];

export const LATENCIES = [ 0, 1500, 4000 ];

export type ListState = 'idle' | 'skeleton' | 'transitioning';

interface State {
  readonly variant: VariantKey;
  readonly latencyMs: number;
  readonly listState: ListState;
}

const STORAGE_KEY = 'PROTOTYPE_3697_page_transition';
const DEFAULT_STATE: State = { variant: 'dim', latencyMs: 1500, listState: 'idle' };
// outside `next dev` (production, unit tests) the app behaves exactly as on the feature branch
const DISABLED_STATE: State = { variant: 'skeleton', latencyMs: 0, listState: 'idle' };

// eslint-disable-next-line no-restricted-properties -- NODE_ENV is a build flag, not a NEXT_PUBLIC env var; it keeps the prototype out of prod and tests
export const isPrototypeEnabled = process.env.NODE_ENV === 'development';

function isVariantKey(value: unknown): value is VariantKey {
  return VARIANTS.some(({ key }) => key === value);
}

function readInitialState(): State {
  if (typeof window === 'undefined') {
    return DEFAULT_STATE;
  }

  const params = new URLSearchParams(window.location.search);
  const stored = JSON.parse(window.sessionStorage.getItem(STORAGE_KEY) ?? '{}') as Partial<State>;

  const variant = params.get('variant') ?? stored.variant;
  const latency = Number(params.get('latency') ?? stored.latencyMs ?? DEFAULT_STATE.latencyMs);

  return {
    variant: isVariantKey(variant) ? variant : DEFAULT_STATE.variant,
    latencyMs: Number.isFinite(latency) ? latency : DEFAULT_STATE.latencyMs,
    listState: 'idle',
  };
}

let state: State | undefined;
const listeners = new Set<() => void>();

function getState(): State {
  if (!isPrototypeEnabled) {
    return DISABLED_STATE;
  }
  state ??= readInitialState();
  return state;
}

function getServerState(): State {
  return DEFAULT_STATE;
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function setPrototypeState(patch: Partial<State>) {
  if (!isPrototypeEnabled) {
    return;
  }

  const current = getState();
  if (Object.entries(patch).every(([ key, value ]) => current[key as keyof State] === value)) {
    return;
  }

  state = { ...current, ...patch };
  window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ variant: state.variant, latencyMs: state.latencyMs }));
  listeners.forEach((listener) => listener());
}

export function usePageTransitionPrototype(): State {
  return React.useSyncExternalStore(subscribe, getState, getServerState);
}
