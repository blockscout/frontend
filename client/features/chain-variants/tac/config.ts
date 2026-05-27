// SPDX-License-Identifier: LicenseRef-Blockscout

import apis from 'client/config/apis';
import { getEnvValue } from 'client/config/utils/envs';
import type { Feature } from 'client/config/utils/features';

const title = 'Ton Application Chain (TAC)';

const tonExplorerUrl = getEnvValue('NEXT_PUBLIC_TAC_TON_EXPLORER_URL');

const config: Feature<{ tonExplorerUrl: string }> = (() => {
  if (apis.tac && tonExplorerUrl) {
    return Object.freeze({
      title,
      isEnabled: true,
      tonExplorerUrl,
    });
  }

  return Object.freeze({
    title,
    isEnabled: false,
  });
})();

export default config;
