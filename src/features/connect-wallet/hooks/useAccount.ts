// SPDX-License-Identifier: LicenseRef-Blockscout

import config from 'src/config';
import { getFeaturePayload } from 'src/config/utils/features';

import useAccountDynamicLazy from './account/useAccountDynamicLazy';
import useAccountFallback from './account/useAccountFallback';
import useAccountReown from './account/useAccountReown';

const payload = getFeaturePayload(config.features.connectWallet);

// Synchronous hub (no top-level await): reown is a light Bridge-backed hook wired
// directly, so the header's module graph no longer awaits the wallet/appkit chunks. The heavy dynamic
// stack stays lazy behind `useAccountDynamicLazy` so it never enters the reown/fallback bundle.
// eslint-disable-next-line no-nested-ternary
const useAccount = payload?.connectorType === 'dynamic' ?
  useAccountDynamicLazy :
  payload?.connectorType === 'reown' ?
    useAccountReown :
    useAccountFallback;

export default useAccount;
