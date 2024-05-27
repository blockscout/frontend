import type { Feature } from './types';
import type { DeFiDropdownItem } from 'types/client/deFiDropdown';

import { getEnvValue, parseEnvJson } from '../utils';

const items = parseEnvJson<Array<DeFiDropdownItem>>(getEnvValue('NEXT_PUBLIC_DEFI_DROPDOWN_ITEMS')) || [];

const title = 'DeFi dropdown';

const config: Feature<{ items: Array<DeFiDropdownItem> }> = items.length > 0 ?
  Object.freeze({
    title,
    isEnabled: true,
    items,
  }) :
  Object.freeze({
    title,
    isEnabled: false,
  });

export default config;
