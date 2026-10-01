// SPDX-License-Identifier: LicenseRef-Blockscout

import * as v from 'valibot';

import { envBoolean, envJson, envPositiveInteger, envRequiredString, envUrl, requires } from '../utils';

export default v.pipe(
  v.looseObject({
    NEXT_PUBLIC_NETWORK_NAME: envRequiredString(),
    NEXT_PUBLIC_NETWORK_SHORT_NAME: v.optional(v.string()),
    NEXT_PUBLIC_NETWORK_ID: envPositiveInteger(),
    NEXT_PUBLIC_NETWORK_RPC_URL: v.optional(v.union([
      envUrl(),
      envJson(v.array(v.pipe(v.string(), v.url()))),
    ])),
    NEXT_PUBLIC_NETWORK_CURRENCY_NAME: v.optional(v.string()),
    NEXT_PUBLIC_NETWORK_CURRENCY_WEI_NAME: v.optional(v.string()),
    NEXT_PUBLIC_NETWORK_CURRENCY_GWEI_NAME: v.optional(v.string()),
    NEXT_PUBLIC_NETWORK_CURRENCY_SYMBOL: v.optional(v.string()),
    NEXT_PUBLIC_NETWORK_CURRENCY_DECIMALS: v.optional(envPositiveInteger()),
    NEXT_PUBLIC_NETWORK_SECONDARY_COIN_SYMBOL: v.optional(v.string()),
    NEXT_PUBLIC_NETWORK_MULTIPLE_GAS_CURRENCIES: v.optional(envBoolean()),
    NEXT_PUBLIC_NETWORK_VERIFICATION_TYPE: v.optional(v.picklist([ 'validation', 'mining', 'fee reception' ])),
    NEXT_PUBLIC_NETWORK_TOKEN_STANDARD_NAME: v.optional(v.string()),
    NEXT_PUBLIC_NETWORK_ADDITIONAL_TOKEN_TYPES: v.optional(envJson(v.array(v.strictObject({
      id: v.pipe(v.string(), v.nonEmpty()),
      name: v.pipe(v.string(), v.nonEmpty()),
    })))),
    NEXT_PUBLIC_IS_TESTNET: v.optional(envBoolean()),
  }),
  requires('NEXT_PUBLIC_NETWORK_VERIFICATION_TYPE', 'NEXT_PUBLIC_ROLLUP_TYPE', {
    when: (rollupType) => rollupType !== 'arbitrum',
    message: 'NEXT_PUBLIC_NETWORK_VERIFICATION_TYPE can not be set for Arbitrum rollups',
  }),
);
