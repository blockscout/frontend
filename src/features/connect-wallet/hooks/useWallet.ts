// SPDX-License-Identifier: LicenseRef-Blockscout

import config from 'src/config';
import { getFeaturePayload } from 'src/config/utils/features';

import useWalletFallback from './wallet/useWalletFallback';
import useWalletReown from './wallet/useWalletReown';

const payload = getFeaturePayload(config.features.connectWallet);

// Synchronous hub (no top-level await): reown is a light Bridge/Runtime-backed hook wired
// directly, so the header's module graph no longer awaits the wallet/appkit chunks.
// (`useWalletReown`'s default already self-selects reown-vs-fallback, matching the reown branch.)
const useWallet = payload?.connectorType === 'reown' ? useWalletReown : useWalletFallback;

export default useWallet;
