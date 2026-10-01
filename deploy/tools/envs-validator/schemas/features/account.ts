// SPDX-License-Identifier: LicenseRef-Blockscout

import * as v from 'valibot';

import { envBoolean, requiredIf, requires } from '../../utils';

const isDynamicProvider = (provider: unknown) => provider === 'dynamic';

export const accountSchema = v.pipe(
  v.object({
    NEXT_PUBLIC_IS_ACCOUNT_SUPPORTED: v.optional(envBoolean()),
    NEXT_PUBLIC_ACCOUNT_AUTH_PROVIDER: v.optional(v.picklist([ 'auth0', 'dynamic' ])),
    NEXT_PUBLIC_ACCOUNT_DYNAMIC_ENVIRONMENT_ID: v.optional(v.string()),
    NEXT_PUBLIC_TOKEN_INFO_EXPEDITED_REVIEW_HTML: v.optional(v.string()),
  }),
  requires('NEXT_PUBLIC_ACCOUNT_AUTH_PROVIDER', 'NEXT_PUBLIC_IS_ACCOUNT_SUPPORTED', {
    message: 'NEXT_PUBLIC_ACCOUNT_AUTH_PROVIDER can only be used if NEXT_PUBLIC_IS_ACCOUNT_SUPPORTED is set to \'true\'',
  }),
  requires('NEXT_PUBLIC_ACCOUNT_DYNAMIC_ENVIRONMENT_ID', 'NEXT_PUBLIC_ACCOUNT_AUTH_PROVIDER', {
    when: isDynamicProvider,
    message: 'NEXT_PUBLIC_ACCOUNT_DYNAMIC_ENVIRONMENT_ID can only be used if NEXT_PUBLIC_ACCOUNT_AUTH_PROVIDER is set to \'dynamic\' ',
  }),
  requiredIf('NEXT_PUBLIC_ACCOUNT_DYNAMIC_ENVIRONMENT_ID', 'NEXT_PUBLIC_ACCOUNT_AUTH_PROVIDER', { when: isDynamicProvider }),
  requires('NEXT_PUBLIC_TOKEN_INFO_EXPEDITED_REVIEW_HTML', 'NEXT_PUBLIC_IS_ACCOUNT_SUPPORTED', {
    message: 'NEXT_PUBLIC_TOKEN_INFO_EXPEDITED_REVIEW_HTML can only be used if NEXT_PUBLIC_IS_ACCOUNT_SUPPORTED is set to \'true\'',
  }),
);
