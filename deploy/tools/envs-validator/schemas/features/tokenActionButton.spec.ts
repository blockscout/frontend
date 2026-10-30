// SPDX-License-Identifier: LicenseRef-Blockscout

import type { TokenActionButtonConfig } from 'src/features/token-action-button/types/config';

import { describe, expect, it } from 'vitest';

import { toEnvValue } from '../../test-utils';
import { getValidationErrors } from '../../utils';
import { tokenActionButtonSchema } from './tokenActionButton';

const button: TokenActionButtonConfig = {
  text: 'Buy on Example Portal',
  url: 'https://portal.example.com/swap?chainId=1&token={hash}',
};

describe('tokenActionButtonSchema', () => {
  it('accepts a button with logo and colors', () => {
    expect(getValidationErrors(tokenActionButtonSchema, {
      NEXT_PUBLIC_TOKEN_ACTION_BUTTON_CONFIG: toEnvValue({
        ...button,
        logo: [ 'https://example.com/logo-light.svg', 'https://example.com/logo-dark.svg' ],
        colors: { _default: { bg: [ 'rgb(134, 86, 239)' ], text: [ 'white' ] } },
      }),
    })).toEqual([]);
  });

  it('rejects a button without text', () => {
    expect(getValidationErrors(tokenActionButtonSchema, {
      NEXT_PUBLIC_TOKEN_ACTION_BUTTON_CONFIG: toEnvValue({ url: button.url }),
    })).toEqual([ 'NEXT_PUBLIC_TOKEN_ACTION_BUTTON_CONFIG.text: Invalid key: Expected "text" but received undefined' ]);
  });

  it('rejects a button with a malformed url', () => {
    expect(getValidationErrors(tokenActionButtonSchema, {
      NEXT_PUBLIC_TOKEN_ACTION_BUTTON_CONFIG: toEnvValue({ ...button, url: 'not a url' }),
    })).toEqual([ 'NEXT_PUBLIC_TOKEN_ACTION_BUTTON_CONFIG.url: Invalid URL: Received "not a url"' ]);
  });

  it('rejects more than two logo urls', () => {
    expect(getValidationErrors(tokenActionButtonSchema, {
      NEXT_PUBLIC_TOKEN_ACTION_BUTTON_CONFIG: toEnvValue({ ...button, logo: [ 'https://a.com/1.svg', 'https://a.com/2.svg', 'https://a.com/3.svg' ] }),
    })).toEqual([ 'NEXT_PUBLIC_TOKEN_ACTION_BUTTON_CONFIG.logo: Invalid length: Expected <=2 but received 3' ]);
  });
});
