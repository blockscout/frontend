// SPDX-License-Identifier: LicenseRef-Blockscout

import * as v from 'valibot';

import { envBoolean, envPositiveInteger, envRequiredString, protocols } from '../utils';

export const buildTimeSchema = v.object({
  NEXT_PUBLIC_GIT_TAG: v.optional(v.string()),
  NEXT_PUBLIC_GIT_COMMIT_SHA: v.optional(v.string()),
});

export const appSchema = v.object({
  NEXT_PUBLIC_APP_HOST: envRequiredString(),
  NEXT_PUBLIC_APP_PROTOCOL: v.optional(v.picklist(protocols)),
  NEXT_PUBLIC_APP_PORT: v.optional(envPositiveInteger()),
  NEXT_PUBLIC_APP_ENV: v.optional(v.string()),
  NEXT_PUBLIC_APP_INSTANCE: v.optional(v.string()),
});

export const proxySchema = v.object({
  NEXT_PUBLIC_USE_NEXT_JS_PROXY: v.optional(envBoolean()),
});
