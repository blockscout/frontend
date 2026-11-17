// SPDX-License-Identifier: LicenseRef-Blockscout

import type { BlockFieldId, BlockViewId } from 'src/slices/block/types/config';
import { BLOCK_FIELDS_IDS, BLOCK_VIEWS_IDS } from 'src/slices/block/types/config';

import { getEnvValue, parseEnvJson } from 'src/config/utils/envs';

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

const hiddenViews = (() => {
  const parsedValue = parseEnvJson<Array<BlockViewId>>(getEnvValue('NEXT_PUBLIC_VIEWS_BLOCK_HIDDEN_VIEWS')) || [];

  if (!Array.isArray(parsedValue) || parsedValue.length === 0) {
    return undefined;
  }

  const result = BLOCK_VIEWS_IDS.reduce((result, item) => {
    result[item] = parsedValue.includes(item);
    return result;
  }, {} as Record<BlockViewId, boolean>);

  return result;
})();

const config = Object.freeze({
  hiddenFields: blockHiddenFields,
  hiddenViews,
  pendingUpdateAlertEnabled: getEnvValue('NEXT_PUBLIC_VIEWS_BLOCK_PENDING_UPDATE_ALERT_ENABLED') !== 'false',
});

export default config;
