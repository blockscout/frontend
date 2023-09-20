import type { IdenticonType } from 'types/views/address';
import { IDENTICON_TYPES } from 'types/views/address';

import { getEnvValue } from 'configs/app/utils';

const identiconType: IdenticonType = (() => {
  const value = getEnvValue(process.env.NEXT_PUBLIC_VIEWS_ADDRESS_IDENTICON_TYPE);

  return IDENTICON_TYPES.find((type) => value === type) || 'jazzicon';
})();

const config = Object.freeze({
  identiconType: identiconType,
});

export default config;
