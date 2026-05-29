// SPDX-License-Identifier: LicenseRef-Blockscout

import apis from 'src/config/apis';
import type { Feature } from 'src/config/utils/features';

const title = 'Verified tokens info';

const config: Feature<{}> = (() => {
  if (apis.contractInfo) {
    return Object.freeze({
      title,
      isEnabled: true,
    });
  }

  return Object.freeze({
    title,
    isEnabled: false,
  });
})();

export default config;
