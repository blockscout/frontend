// SPDX-License-Identifier: LicenseRef-Blockscout

import type CspDev from 'csp-dev';

import { KEY_WORDS } from '../utils';

// CloudFlare analytics
export function cloudFlare(isPrivateMode: boolean): CspDev.DirectiveDescriptor {
  if (isPrivateMode) {
    return {};
  }

  return {
    'script-src': [
      'static.cloudflareinsights.com',
    ],
    'style-src': [
      KEY_WORDS.DATA,
    ],
  };
}
