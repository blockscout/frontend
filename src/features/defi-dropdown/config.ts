// SPDX-License-Identifier: LicenseRef-Blockscout

import type { DeFiDropdownItem } from 'src/features/defi-dropdown/types/client';

import app from 'src/config/app';
import { getEnvValue, parseEnvJson } from 'src/config/utils/envs';
import type { Feature } from 'src/config/utils/features';

const items = parseEnvJson<Array<DeFiDropdownItem>>(getEnvValue('NEXT_PUBLIC_DEFI_DROPDOWN_ITEMS')) || [];

const title = 'DeFi dropdown';

const config: Feature<{ items: Array<DeFiDropdownItem> }> = (() => {
  if (!app.isPrivateMode && items.length > 0) {
    return Object.freeze({
      title,
      isEnabled: true,
      items,
    });
  }
  return Object.freeze({
    title,
    isEnabled: false,
  });
})();

export default config;
