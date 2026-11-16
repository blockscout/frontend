// SPDX-License-Identifier: LicenseRef-Blockscout

import * as v from 'valibot';

import { envBoolean, envHtml, requires } from '../../utils';

export const accountSchema = v.pipe(
  v.object({
    NEXT_PUBLIC_IS_ACCOUNT_SUPPORTED: v.optional(envBoolean()),
    NEXT_PUBLIC_ACCOUNT_AUTH_PROVIDER: v.optional(v.picklist([ 'auth0' ])),
    NEXT_PUBLIC_TOKEN_INFO_EXPEDITED_REVIEW_HTML: v.optional(envHtml()),
  }),
  requires('NEXT_PUBLIC_ACCOUNT_AUTH_PROVIDER', 'NEXT_PUBLIC_IS_ACCOUNT_SUPPORTED', {
    message: 'NEXT_PUBLIC_ACCOUNT_AUTH_PROVIDER can only be used if NEXT_PUBLIC_IS_ACCOUNT_SUPPORTED is set to \'true\'',
  }),
  requires('NEXT_PUBLIC_TOKEN_INFO_EXPEDITED_REVIEW_HTML', 'NEXT_PUBLIC_IS_ACCOUNT_SUPPORTED', {
    message: 'NEXT_PUBLIC_TOKEN_INFO_EXPEDITED_REVIEW_HTML can only be used if NEXT_PUBLIC_IS_ACCOUNT_SUPPORTED is set to \'true\'',
  }),
);
