// SPDX-License-Identifier: LicenseRef-Blockscout

import { getEnvValue, parseEnvJson } from 'client/config/utils/envs';

import type { BlockFieldId } from 'client/slices/block/types/config';
import { BLOCK_FIELDS_IDS } from 'client/slices/block/types/config';

const blockHiddenFields = (() => {
  const parsedValue = parseEnvJson<Array<BlockFieldId>>(getEnvValue('NEXT_PUBLIC_VIEWS_BLOCK_HIDDEN_FIELDS')) || [];

  if (!Array.isArray(parsedValue)) {
    return undefined;
  }

  const result = BLOCK_FIELDS_IDS.reduce((result, item) => {
    result[item] = parsedValue.includes(item);
    return result;
  }, {} as Record<BlockFieldId, boolean>);

  return result;
})();

const config = Object.freeze({
  hiddenFields: blockHiddenFields,
  pendingUpdateAlertEnabled: getEnvValue('NEXT_PUBLIC_VIEWS_BLOCK_PENDING_UPDATE_ALERT_ENABLED') !== 'false',
});

export default config;
