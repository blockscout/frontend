// SPDX-License-Identifier: LicenseRef-Blockscout

import type CspDev from 'csp-dev';

import { makePolicyString, KEY_WORDS } from './utils';

// Broad on purpose: the untrusted NFT markup runs in an iframe nested in this shell document, and
// still needs a permissive policy to run typical NFT animations (inline scripts, eval in some
// bundles, arbitrary `connect-src`, images, fonts, nested frames).
export default function generateNftHtmlEmbedCspPolicy(): string {

  const descriptor: CspDev.DirectiveDescriptor = {
    'default-src': [ KEY_WORDS.NONE ],

    'script-src': [
      KEY_WORDS.UNSAFE_INLINE,
      KEY_WORDS.UNSAFE_EVAL,
      KEY_WORDS.SELF,
      KEY_WORDS.DATA,
      KEY_WORDS.BLOB,
      '*',
    ],

    'style-src': [
      KEY_WORDS.UNSAFE_INLINE,
      KEY_WORDS.SELF,
      '*',
    ],

    'img-src': [ KEY_WORDS.DATA, KEY_WORDS.BLOB, '*' ],

    'font-src': [ KEY_WORDS.DATA, KEY_WORDS.SELF, '*' ],

    'connect-src': [ '*' ],

    'media-src': [ KEY_WORDS.BLOB, '*' ],

    'object-src': [ KEY_WORDS.NONE ],

    'base-uri': [ KEY_WORDS.NONE ],

    'frame-ancestors': [ KEY_WORDS.SELF ],

    // `frame-src *` does not cover `data:` URLs; without it, framing an NFT given as one fails
    'frame-src': [ '*', KEY_WORDS.DATA ],
  };

  return makePolicyString(descriptor);
}
