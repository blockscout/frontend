// SPDX-License-Identifier: LicenseRef-Blockscout

import type { UseAccountReturnType } from 'wagmi';

import type { Params, Result } from '../hooks/wallet/types';

interface DynamicHooks {
  readonly useWallet: (params: Params) => Result;
  readonly useAccount: () => UseAccountReturnType;
}

// The @dynamic-labs hooks must not be imported statically from the synchronous `useWallet` / `useAccount`
// hubs, or they would enter the reown/fallback bundle. `DynamicProvider` — itself an async chunk that
// wraps the whole app in dynamic mode — registers them at module scope instead, so by the time any child
// renders they resolve synchronously and nothing suspends after first paint.
let hooks: DynamicHooks | undefined;

export function registerDynamicHooks(value: DynamicHooks): void {
  hooks = value;
}

function getDynamicHooks(): DynamicHooks {
  if (!hooks) {
    throw new Error('Dynamic wallet hooks are not registered: render inside <DynamicProvider>');
  }
  return hooks;
}

export function useWalletDynamicRegistered(params: Params): Result {
  return getDynamicHooks().useWallet(params);
}

export function useAccountDynamicRegistered(): UseAccountReturnType {
  return getDynamicHooks().useAccount();
}
