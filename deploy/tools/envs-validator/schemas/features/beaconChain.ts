// SPDX-License-Identifier: LicenseRef-Blockscout

import * as v from 'valibot';

import { envBoolean, requires } from '../../utils';

export const beaconChainSchema = v.pipe(
  v.object({
    NEXT_PUBLIC_HAS_BEACON_CHAIN: v.optional(envBoolean()),
    NEXT_PUBLIC_BEACON_CHAIN_WITHDRAWALS_ONLY: v.optional(envBoolean()),
    NEXT_PUBLIC_BEACON_CHAIN_CURRENCY_SYMBOL: v.optional(v.pipe(v.string(), v.nonEmpty())),
    NEXT_PUBLIC_BEACON_CHAIN_VALIDATOR_URL_TEMPLATE: v.optional(v.string()),
  }),
  requires('NEXT_PUBLIC_BEACON_CHAIN_WITHDRAWALS_ONLY', 'NEXT_PUBLIC_HAS_BEACON_CHAIN', {
    message: 'NEXT_PUBLIC_BEACON_CHAIN_WITHDRAWALS_ONLY can only be used if NEXT_PUBLIC_HAS_BEACON_CHAIN is set to "true"',
  }),
  requires('NEXT_PUBLIC_BEACON_CHAIN_CURRENCY_SYMBOL', 'NEXT_PUBLIC_HAS_BEACON_CHAIN', {
    message: 'NEXT_PUBLIC_BEACON_CHAIN_CURRENCY_SYMBOL cannot not be used if NEXT_PUBLIC_HAS_BEACON_CHAIN is not set to "true"',
  }),
  requires('NEXT_PUBLIC_BEACON_CHAIN_VALIDATOR_URL_TEMPLATE', 'NEXT_PUBLIC_HAS_BEACON_CHAIN', {
    message: 'NEXT_PUBLIC_BEACON_CHAIN_VALIDATOR_URL_TEMPLATE cannot not be used if NEXT_PUBLIC_HAS_BEACON_CHAIN is not set to "true"',
  }),
);
