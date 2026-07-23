// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';
import type { UseAccountReturnType } from 'wagmi';

// Light wrapper that keeps the heavy @dynamic-labs stack out of the reown/fallback critical bundle: the
// (untouched) dynamic account hook is loaded via a dynamic import — its own async chunk — and `use()`
// suspends until it resolves. See useWalletDynamicLazy for the gating rationale.
let hookPromise: Promise<() => UseAccountReturnType> | undefined;

export default function useAccountDynamicLazy(): UseAccountReturnType {
  hookPromise = hookPromise ?? import('./useAccountDynamic').then((module) => module.default);
  const useAccountDynamic = React.use(hookPromise);
  return useAccountDynamic();
}
