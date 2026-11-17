// SPDX-License-Identifier: LicenseRef-Blockscout

import * as v from 'valibot';

import { envJson, envUrl, requiredIf, requires } from '../../utils';

const bridgedTokenChainSchema = v.object({
  id: v.pipe(v.string(), v.nonEmpty()),
  title: v.pipe(v.string(), v.nonEmpty()),
  short_title: v.pipe(v.string(), v.nonEmpty()),
  base_url: v.pipe(envUrl(), v.nonEmpty()),
});

const tokenBridgeSchema = v.object({
  type: v.pipe(v.string(), v.nonEmpty()),
  title: v.pipe(v.string(), v.nonEmpty()),
  short_title: v.pipe(v.string(), v.nonEmpty()),
});

const hasItems = (value: unknown) => Array.isArray(value) && value.length > 0;

export const bridgedTokensSchema = v.pipe(
  v.object({
    NEXT_PUBLIC_BRIDGED_TOKENS_CHAINS: v.optional(envJson(v.array(bridgedTokenChainSchema))),
    NEXT_PUBLIC_BRIDGED_TOKENS_BRIDGES: v.optional(envJson(v.array(tokenBridgeSchema))),
  }),
  requires('NEXT_PUBLIC_BRIDGED_TOKENS_BRIDGES', 'NEXT_PUBLIC_BRIDGED_TOKENS_CHAINS', {
    when: hasItems,
    message: 'NEXT_PUBLIC_BRIDGED_TOKENS_BRIDGES cannot not be used without NEXT_PUBLIC_BRIDGED_TOKENS_CHAINS',
  }),
  requiredIf('NEXT_PUBLIC_BRIDGED_TOKENS_BRIDGES', 'NEXT_PUBLIC_BRIDGED_TOKENS_CHAINS', { when: hasItems }),
);
