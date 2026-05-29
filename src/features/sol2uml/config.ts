// SPDX-License-Identifier: LicenseRef-Blockscout

import apis from 'src/config/apis';
import type { Feature } from 'src/config/utils/features';

const title = 'Solidity to UML diagrams';

const config: Feature<{}> = (() => {
  if (apis.visualize) {
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
