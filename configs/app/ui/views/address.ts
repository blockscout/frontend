import type { SmartContractVerificationMethodExtra } from 'types/client/contract';
import { SMART_CONTRACT_EXTRA_VERIFICATION_METHODS } from 'types/client/contract';
import type { AddressViewId, IdenticonType } from 'types/views/address';
import { ADDRESS_VIEWS_IDS, IDENTICON_TYPES } from 'types/views/address';

import { getEnvValue, parseEnvJson } from 'configs/app/utils';

const identiconType: IdenticonType = (() => {
  const value = getEnvValue('NEXT_PUBLIC_VIEWS_ADDRESS_IDENTICON_TYPE');

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

const extraVerificationMethods: Array<SmartContractVerificationMethodExtra> = (() => {
  const envValue = getEnvValue('NEXT_PUBLIC_VIEWS_CONTRACT_EXTRA_VERIFICATION_METHODS');
  if (envValue === 'none') {
    return [];
  }

  if (!envValue) {
    return SMART_CONTRACT_EXTRA_VERIFICATION_METHODS;
  }

  const parsedMethods = parseEnvJson<Array<SmartContractVerificationMethodExtra>>(getEnvValue('NEXT_PUBLIC_VIEWS_CONTRACT_EXTRA_VERIFICATION_METHODS')) || [];

  return SMART_CONTRACT_EXTRA_VERIFICATION_METHODS.filter((method) => parsedMethods.includes(method));
})();

const config = Object.freeze({
  identiconType,
  hiddenViews,
  solidityscanEnabled: getEnvValue('NEXT_PUBLIC_VIEWS_CONTRACT_SOLIDITYSCAN_ENABLED') === 'true',
  extraVerificationMethods,
});

export default config;
