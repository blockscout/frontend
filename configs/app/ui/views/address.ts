import type { AddressViewId, IdenticonType } from 'types/views/address';
import { ADDRESS_VIEWS_IDS, IDENTICON_TYPES } from 'types/views/address';

import { getEnvValue, parseEnvJson } from 'configs/app/utils';

const identiconType: IdenticonType = (() => {
  let value = getEnvValue('NEXT_PUBLIC_VIEWS_ADDRESS_IDENTICON_TYPE');
  if (value !== undefined && value.includes('universal_profile|')) {
    value = value.split('|')[1];
  }

  return IDENTICON_TYPES.find((type) => value === type) || 'jazzicon';
})();

const hiddenViews = (() => {
  const parsedValue = parseEnvJson<Array<AddressViewId>>(getEnvValue('NEXT_PUBLIC_VIEWS_ADDRESS_HIDDEN_VIEWS')) || [];

  if (!Array.isArray(parsedValue)) {
    return undefined;
  }

  const result = ADDRESS_VIEWS_IDS.reduce((result, item) => {
    result[item] = parsedValue.includes(item);
    return result;
  }, {} as Record<AddressViewId, boolean>);

  return result;
})();

const config = Object.freeze({
  identiconType,
  hiddenViews,
});

export default config;
