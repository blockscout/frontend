// SPDX-License-Identifier: LicenseRef-Blockscout

import * as v from 'valibot';

import type { TokenActionButtonConfig } from 'src/features/token-action-button/types/config';

import { envJson } from '../../utils';

const colorPairSchema = v.optional(v.pipe(v.array(v.string()), v.maxLength(2)));

const tokenActionButtonConfigSchema: v.GenericSchema<TokenActionButtonConfig> = v.object({
  text: v.pipe(v.string(), v.nonEmpty()),
  url: v.pipe(v.string(), v.url()),
  logo: v.optional(v.pipe(v.array(v.pipe(v.string(), v.url())), v.maxLength(2))),
  colors: v.optional(v.object({
    _default: v.optional(v.object({
      bg: colorPairSchema,
      text: colorPairSchema,
    })),
  })),
});

export const tokenActionButtonSchema = v.object({
  NEXT_PUBLIC_TOKEN_ACTION_BUTTON_CONFIG: v.optional(envJson(tokenActionButtonConfigSchema)),
});
