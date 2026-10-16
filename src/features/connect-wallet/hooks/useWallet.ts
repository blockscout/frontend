// SPDX-License-Identifier: LicenseRef-Blockscout

import config from 'src/config';
import { getFeaturePayload } from 'src/config/utils/features';

import { useWalletDynamicRegistered } from '../utils/dynamic-hooks';
import useWalletFallback from './wallet/useWalletFallback';
import useWalletReown from './wallet/useWalletReown';

const payload = getFeaturePayload(config.features.connectWallet);

// Synchronous hub (no top-level await): reown is a light Bridge/Runtime-backed hook wired
// directly, so the header's module graph no longer awaits the wallet/appkit chunks. The heavy dynamic
// stack is registered by `DynamicProvider` (see utils/dynamic-hooks) so it never enters the reown/fallback bundle.
// (`useWalletReown`'s default already self-selects reown-vs-fallback, matching the reown branch.)
// eslint-disable-next-line no-nested-ternary
const useWallet = payload?.connectorType === 'dynamic' ?
  useWalletDynamicRegistered :
  payload?.connectorType === 'reown' ?
    useWalletReown :
    useWalletFallback;

export default useWallet;
