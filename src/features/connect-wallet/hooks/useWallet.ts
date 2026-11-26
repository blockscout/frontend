// SPDX-License-Identifier: LicenseRef-Blockscout

import config from 'src/config';
import { getFeaturePayload } from 'src/config/utils/features';

import useWalletFallback from './wallet/useWalletFallback';
import useWalletReown from './wallet/useWalletReown';

const payload = getFeaturePayload(config.features.connectWallet);

const useWallet = payload?.connectorType === 'reown' ? useWalletReown : useWalletFallback;

export default useWallet;
