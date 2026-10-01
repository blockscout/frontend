// SPDX-License-Identifier: LicenseRef-Blockscout

import * as v from 'valibot';

import { companionRule, envJson, envUrl, requires } from '../../utils';

const zetaChainCCTXConfigSchema = v.object({
  chain_id: v.number(),
  chain_name: v.pipe(v.string(), v.nonEmpty()),
  chain_logo: v.optional(v.string()),
  instance_url: v.optional(v.pipe(v.string(), v.url())),
  address_url_template: v.optional(v.string()),
  tx_url_template: v.optional(v.string()),
});

const externalSearchItemSchema = v.object({
  regex: v.pipe(v.string(), v.nonEmpty()),
  template: v.pipe(v.string(), v.nonEmpty()),
  name: v.pipe(v.string(), v.nonEmpty()),
});

export const zetaChainSchema = v.pipe(
  v.looseObject({
    NEXT_PUBLIC_ZETACHAIN_SERVICE_API_HOST: v.optional(envUrl()),
    NEXT_PUBLIC_ZETACHAIN_SERVICE_CHAINS_CONFIG_URL: v.optional(envJson(v.array(zetaChainCCTXConfigSchema))),
    NEXT_PUBLIC_ZETACHAIN_EXTERNAL_SEARCH_CONFIG: v.optional(envJson(v.array(externalSearchItemSchema))),
  }),
  requires('NEXT_PUBLIC_ZETACHAIN_SERVICE_CHAINS_CONFIG_URL', 'NEXT_PUBLIC_ZETACHAIN_SERVICE_API_HOST', {
    message: 'NEXT_PUBLIC_ZETACHAIN_SERVICE_CHAINS_CONFIG_URL cannot be used if NEXT_PUBLIC_ZETACHAIN_SERVICE_API_HOST is not set',
  }),
  requires('NEXT_PUBLIC_ZETACHAIN_EXTERNAL_SEARCH_CONFIG', 'NEXT_PUBLIC_ZETACHAIN_SERVICE_API_HOST', {
    message: 'NEXT_PUBLIC_ZETACHAIN_EXTERNAL_SEARCH_CONFIG cannot be used if NEXT_PUBLIC_ZETACHAIN_SERVICE_API_HOST is not set',
  }),
  companionRule(
    [ 'NEXT_PUBLIC_ZETACHAIN_SERVICE_API_HOST', 'NEXT_PUBLIC_ZETACHAIN_SERVICE_CHAINS_CONFIG_URL' ],
    (input) => {
      const chainsConfig = input.NEXT_PUBLIC_ZETACHAIN_SERVICE_CHAINS_CONFIG_URL;
      return !input.NEXT_PUBLIC_ZETACHAIN_SERVICE_API_HOST || (Array.isArray(chainsConfig) && chainsConfig.length > 0);
    },
    'NEXT_PUBLIC_ZETACHAIN_SERVICE_API_HOST cannot be used without NEXT_PUBLIC_ZETACHAIN_SERVICE_CHAINS_CONFIG_URL',
  ),
);
