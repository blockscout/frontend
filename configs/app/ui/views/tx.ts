// SPDX-License-Identifier: LicenseRef-Blockscout

import type { TxAdditionalFieldsId, TxFieldsId, TxViewId } from 'client/slices/tx/types/config';
import { TX_ADDITIONAL_FIELDS_IDS, TX_FIELDS_IDS, TX_VIEWS_IDS } from 'client/slices/tx/types/config';

import { getEnvValue, parseEnvJson } from 'configs/app/utils';

const hiddenFields = (() => {
  const parsedValue = parseEnvJson<Array<TxFieldsId>>(getEnvValue('NEXT_PUBLIC_VIEWS_TX_HIDDEN_FIELDS')) || [];

  if (!Array.isArray(parsedValue) || parsedValue.length === 0) {
    return undefined;
  }

  const result = TX_FIELDS_IDS.reduce((result, item) => {
    result[item] = parsedValue.includes(item);
    return result;
  }, {} as Record<TxFieldsId, boolean>);

  return result;
})();

const hiddenViews = (() => {
  const parsedValue = parseEnvJson<Array<TxViewId>>(getEnvValue('NEXT_PUBLIC_VIEWS_TX_HIDDEN_VIEWS')) || [];

  if (!Array.isArray(parsedValue) || parsedValue.length === 0) {
    return undefined;
  }

  const result = TX_VIEWS_IDS.reduce((result, item) => {
    result[item] = parsedValue.includes(item);
    return result;
  }, {} as Record<TxViewId, boolean>);

  return result;
})();

const additionalFields = (() => {
  const parsedValue = parseEnvJson<Array<TxAdditionalFieldsId>>(getEnvValue('NEXT_PUBLIC_VIEWS_TX_ADDITIONAL_FIELDS')) || [];

  if (!Array.isArray(parsedValue) || parsedValue.length === 0) {
    return undefined;
  }

  const result = TX_ADDITIONAL_FIELDS_IDS.reduce((result, item) => {
    result[item] = parsedValue.includes(item);
    return result;
  }, {} as Record<TxAdditionalFieldsId, boolean>);

  return result;
})();

const config = Object.freeze({
  hiddenFields,
  hiddenViews,
  additionalFields,
  groupedFees: getEnvValue('NEXT_PUBLIC_VIEWS_TX_GROUPED_FEES') === 'true',
});

export default config;
