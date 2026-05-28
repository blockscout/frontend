// SPDX-License-Identifier: LicenseRef-Blockscout

import type { Provider } from 'client/features/tx-interpretation/common/types/config';
import { PROVIDERS } from 'client/features/tx-interpretation/common/types/config';

import { getEnvValue } from 'client/config/utils/envs';
import type { Feature } from 'client/config/utils/features';

const title = 'Transaction interpretation';

const provider: Provider = (() => {
  const value = getEnvValue('NEXT_PUBLIC_TRANSACTION_INTERPRETATION_PROVIDER');

  if (value && PROVIDERS.includes(value as Provider)) {
    return value as Provider;
  }

  return 'none';
})();

const config: Feature<{ provider: Provider }> = (() => {
  if (provider !== 'none') {
    return Object.freeze({
      title,
      provider,
      isEnabled: true,
    });
  }

  return Object.freeze({
    title,
    isEnabled: false,
  });
})();

export default config;
