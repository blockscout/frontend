// SPDX-License-Identifier: LicenseRef-Blockscout

import * as v from 'valibot';

import { envJson, requires } from '../utils';

export default v.pipe(
  v.object({
    NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID: v.optional(v.string()),
    NEXT_PUBLIC_WALLET_CONNECT_FEATURED_WALLET_IDS: v.optional(envJson(v.array(v.string()))),

    NEXT_PUBLIC_RE_CAPTCHA_APP_SITE_KEY: v.optional(v.string()),
    NEXT_PUBLIC_GOOGLE_ANALYTICS_PROPERTY_ID: v.optional(v.string()),
    NEXT_PUBLIC_GROWTH_BOOK_CLIENT_KEY: v.optional(v.string()),
    NEXT_PUBLIC_ROLLBAR_CLIENT_TOKEN: v.optional(v.string()),

    NEXT_PUBLIC_MIXPANEL_PROJECT_TOKEN: v.optional(v.string()),
    NEXT_PUBLIC_MIXPANEL_CONFIG_OVERRIDES: v.optional(envJson(v.record(v.string(), v.unknown()))),
  }),
  requires('NEXT_PUBLIC_MIXPANEL_CONFIG_OVERRIDES', 'NEXT_PUBLIC_MIXPANEL_PROJECT_TOKEN', {
    message: 'NEXT_PUBLIC_MIXPANEL_CONFIG_OVERRIDES can only be used if NEXT_PUBLIC_MIXPANEL_PROJECT_TOKEN is set to a non-empty string',
  }),
);
