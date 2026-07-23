// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

import type { Params, Result } from './types';

// The @dynamic-labs stack is heavy and only needed in `dynamic` connector mode. This light wrapper keeps
// it out of the reown/fallback critical bundle: the (untouched) dynamic wallet hook is pulled in via a
// dynamic import — its own async chunk — and `use()` suspends until it resolves. In dynamic mode the whole
// app already renders behind Web3Provider's `next/dynamic(ssr: false)` gate, so this suspends into that
// same window rather than adding a new visible loading state.
let hookPromise: Promise<(params: Params) => Result> | undefined;

export default function useWalletDynamicLazy(params: Params): Result {
  hookPromise = hookPromise ?? import('./useWalletDynamic').then((module) => module.default);
  const useWalletDynamic = React.use(hookPromise);
  return useWalletDynamic(params);
}
