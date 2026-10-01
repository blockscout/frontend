// SPDX-License-Identifier: LicenseRef-Blockscout

import * as v from 'valibot';

import { ROLLUP_TYPES } from 'src/features/rollup/common/types/config';

import * as regexp from 'src/toolkit/utils/regexp';

import { envBoolean, envJson, envNumber, envPositiveInteger, envUrl, requiredIf, requires } from '../../utils';

const parentChainCurrencySchema = v.object({
  name: v.pipe(v.string(), v.nonEmpty()),
  symbol: v.pipe(v.string(), v.nonEmpty()),
  decimals: v.number(),
});

const parentChainSchema = v.object({
  id: v.optional(v.number()),
  name: v.optional(v.string()),
  baseUrl: v.pipe(v.string(), v.nonEmpty(), v.url()),
  rpcUrls: v.optional(v.array(v.pipe(v.string(), v.url()))),
  currency: v.optional(parentChainCurrencySchema),
  isTestnet: v.optional(v.boolean()),
});

const isOptimistic = (type: unknown) => type === 'optimistic';
const isArbitrum = (type: unknown) => type === 'arbitrum';

export const rollupSchema = v.pipe(
  v.looseObject({
    NEXT_PUBLIC_ROLLUP_TYPE: v.optional(v.picklist(ROLLUP_TYPES)),
    NEXT_PUBLIC_ROLLUP_PARENT_CHAIN: v.optional(envJson(parentChainSchema)),
    NEXT_PUBLIC_ROLLUP_L2_WITHDRAWAL_URL: v.optional(envUrl()),
    NEXT_PUBLIC_ROLLUP_OUTPUT_ROOTS_ENABLED: v.optional(envBoolean()),
    NEXT_PUBLIC_INTEROP_ENABLED: v.optional(envBoolean()),
    NEXT_PUBLIC_FAULT_PROOF_ENABLED: v.optional(envBoolean()),
    NEXT_PUBLIC_ROLLUP_HOMEPAGE_SHOW_LATEST_BLOCKS: v.optional(envBoolean()),
    NEXT_PUBLIC_ROLLUP_DA_CELESTIA_NAMESPACE: v.optional(v.pipe(v.string(), v.length(60), v.regex(regexp.HEX_REGEXP_WITH_0X))),
    NEXT_PUBLIC_ROLLUP_DA_CELESTIA_CELENIUM_URL: v.optional(envUrl()),
    NEXT_PUBLIC_ROLLUP_STAGE_INDEX: v.optional(v.pipe(envNumber(), v.picklist([ 1, 2 ]))),
    NEXT_PUBLIC_ROLLUP_LAYER_NUMBER: v.optional(v.pipe(envPositiveInteger(), v.minValue(2))),
  }),
  requires('NEXT_PUBLIC_ROLLUP_PARENT_CHAIN', 'NEXT_PUBLIC_ROLLUP_TYPE', {
    message: 'NEXT_PUBLIC_ROLLUP_PARENT_CHAIN cannot not be used if NEXT_PUBLIC_ROLLUP_TYPE is not defined',
  }),
  requiredIf('NEXT_PUBLIC_ROLLUP_PARENT_CHAIN', 'NEXT_PUBLIC_ROLLUP_TYPE'),
  requires('NEXT_PUBLIC_ROLLUP_L2_WITHDRAWAL_URL', 'NEXT_PUBLIC_ROLLUP_TYPE', {
    when: isOptimistic,
    message: 'NEXT_PUBLIC_ROLLUP_L2_WITHDRAWAL_URL can be used only if NEXT_PUBLIC_ROLLUP_TYPE is set to \'optimistic\' ',
  }),
  requires('NEXT_PUBLIC_ROLLUP_OUTPUT_ROOTS_ENABLED', 'NEXT_PUBLIC_ROLLUP_TYPE', {
    when: isOptimistic,
    message: 'NEXT_PUBLIC_ROLLUP_OUTPUT_ROOTS_ENABLED can only be used if NEXT_PUBLIC_ROLLUP_TYPE is set to \'optimistic\' ',
  }),
  requires('NEXT_PUBLIC_INTEROP_ENABLED', 'NEXT_PUBLIC_ROLLUP_TYPE', {
    when: isOptimistic,
    message: 'NEXT_PUBLIC_INTEROP_ENABLED can only be used if NEXT_PUBLIC_ROLLUP_TYPE is set to \'optimistic\' ',
  }),
  requires('NEXT_PUBLIC_FAULT_PROOF_ENABLED', 'NEXT_PUBLIC_ROLLUP_TYPE', {
    when: isOptimistic,
    message: 'NEXT_PUBLIC_FAULT_PROOF_ENABLED can only be used with NEXT_PUBLIC_ROLLUP_TYPE=optimistic',
  }),
  requires('NEXT_PUBLIC_ROLLUP_HOMEPAGE_SHOW_LATEST_BLOCKS', 'NEXT_PUBLIC_ROLLUP_TYPE', {
    message: 'NEXT_PUBLIC_ROLLUP_HOMEPAGE_SHOW_LATEST_BLOCKS cannot not be used if NEXT_PUBLIC_ROLLUP_TYPE is not defined',
  }),
  requires('NEXT_PUBLIC_ROLLUP_DA_CELESTIA_NAMESPACE', 'NEXT_PUBLIC_ROLLUP_TYPE', {
    when: isArbitrum,
    message: 'NEXT_PUBLIC_ROLLUP_DA_CELESTIA_NAMESPACE can only be used if NEXT_PUBLIC_ROLLUP_TYPE is set to \'arbitrum\' ',
  }),
  requires('NEXT_PUBLIC_ROLLUP_DA_CELESTIA_CELENIUM_URL', 'NEXT_PUBLIC_ROLLUP_TYPE', {
    when: (type) => isArbitrum(type) || isOptimistic(type),
    message: 'NEXT_PUBLIC_ROLLUP_DA_CELESTIA_CELENIUM_URL can only be used if NEXT_PUBLIC_ROLLUP_TYPE is set to \'arbitrum\' or \'optimistic\'',
  }),
  requires('NEXT_PUBLIC_ROLLUP_STAGE_INDEX', 'NEXT_PUBLIC_ROLLUP_TYPE'),
  requires('NEXT_PUBLIC_ROLLUP_LAYER_NUMBER', 'NEXT_PUBLIC_ROLLUP_TYPE'),
);
