import type { ArrayElement } from 'types/utils';

import { getEnvValue, parseEnvJson } from 'configs/app/utils';

export const BLOCK_FIELDS_IDS = [
  'burnt_fees',
  'total_reward',
  'nonce',
] as const;

export type BlockFieldId = ArrayElement<typeof BLOCK_FIELDS_IDS>;

const blockHiddenFields = (() => {
  const parsedValue = parseEnvJson<Array<BlockFieldId>>(getEnvValue(process.env.NEXT_PUBLIC_VIEWS_BLOCK_HIDDEN_FIELDS)) || [];

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
});

export default config;
