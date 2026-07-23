// SPDX-License-Identifier: LicenseRef-Blockscout

import config from 'src/config';
import { getFeaturePayload } from 'src/config/utils/features';

import useWalletDynamicLazy from './wallet/useWalletDynamicLazy';
import useWalletFallback from './wallet/useWalletFallback';
import useWalletReown from './wallet/useWalletReown';

const payload = getFeaturePayload(config.features.connectWallet);

// Synchronous hub (no top-level await): reown is a light Bridge/Runtime-backed hook wired
// directly, so the header's module graph no longer awaits the wallet/appkit chunks. The heavy dynamic
// stack stays lazy behind `useWalletDynamicLazy` so it never enters the reown/fallback bundle.
// (`useWalletReown`'s default already self-selects reown-vs-fallback, matching the reown branch.)
// eslint-disable-next-line no-nested-ternary
const useWallet = payload?.connectorType === 'dynamic' ?
  useWalletDynamicLazy :
  payload?.connectorType === 'reown' ?
    useWalletReown :
    useWalletFallback;

export default useWallet;
