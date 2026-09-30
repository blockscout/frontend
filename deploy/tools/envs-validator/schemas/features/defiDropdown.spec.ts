// SPDX-License-Identifier: LicenseRef-Blockscout

import { describe, expect, it } from 'vitest';

import { deFiDropdownButtonText, deFiDropdownItems } from '../../mocks/defiDropdown';
import { toEnvValue } from '../../test-utils';
import { getValidationErrors } from '../../utils';
import { defiDropdownSchema } from './defiDropdown';

const ITEMS = { NEXT_PUBLIC_DEFI_DROPDOWN_ITEMS: toEnvValue(deFiDropdownItems) };
const BUTTON_TEXT = { NEXT_PUBLIC_DEFI_DROPDOWN_BUTTON_TEXT: toEnvValue(deFiDropdownButtonText) };

describe('defiDropdownSchema', () => {
  it('accepts two items together with the button text', () => {
    expect(getValidationErrors(defiDropdownSchema, { ...ITEMS, ...BUTTON_TEXT })).toEqual([]);
  });

  it('accepts a single item without the button text', () => {
    expect(getValidationErrors(defiDropdownSchema, { NEXT_PUBLIC_DEFI_DROPDOWN_ITEMS: toEnvValue([ deFiDropdownItems[0] ]) })).toEqual([]);
  });

  it('rejects the button text with fewer than two items', () => {
    expect(getValidationErrors(defiDropdownSchema, {
      NEXT_PUBLIC_DEFI_DROPDOWN_ITEMS: toEnvValue([ deFiDropdownItems[0] ]),
      ...BUTTON_TEXT,
    })).toEqual([ 'NEXT_PUBLIC_DEFI_DROPDOWN_BUTTON_TEXT can only be used when NEXT_PUBLIC_DEFI_DROPDOWN_ITEMS contains at least 2 items' ]);
  });

  it('rejects the button text without the desktop label', () => {
    expect(getValidationErrors(defiDropdownSchema, {
      ...ITEMS,
      NEXT_PUBLIC_DEFI_DROPDOWN_BUTTON_TEXT: toEnvValue({ mobile: 'DeFi' }),
    })).toEqual([
      'Invalid schema were provided for NEXT_PUBLIC_DEFI_DROPDOWN_BUTTON_TEXT, it should have a required desktop and an optional mobile field',
    ]);
  });

  it('rejects an item with neither dappId nor url', () => {
    expect(getValidationErrors(defiDropdownSchema, {
      NEXT_PUBLIC_DEFI_DROPDOWN_ITEMS: toEnvValue([ { text: 'Swap', icon: 'swap' } ]),
    })).toEqual([ 'NEXT_PUBLIC_DEFI_DROPDOWN_ITEMS: Either dappId or url is required' ]);
  });

  it('rejects an item with a malformed url', () => {
    expect(getValidationErrors(defiDropdownSchema, {
      NEXT_PUBLIC_DEFI_DROPDOWN_ITEMS: toEnvValue([ { text: 'Payment link', url: 'not a url' } ]),
    })).toEqual([ 'NEXT_PUBLIC_DEFI_DROPDOWN_ITEMS[0].url is not a valid URL' ]);
  });

  it('rejects an item without text', () => {
    expect(getValidationErrors(defiDropdownSchema, {
      NEXT_PUBLIC_DEFI_DROPDOWN_ITEMS: toEnvValue([ { dappId: 'uniswap' } ]),
    })).toEqual([ 'NEXT_PUBLIC_DEFI_DROPDOWN_ITEMS[0].text is a required field' ]);
  });

  it('rejects an item with a malformed essential flag', () => {
    expect(getValidationErrors(defiDropdownSchema, {
      NEXT_PUBLIC_DEFI_DROPDOWN_ITEMS: toEnvValue([ { text: 'Swap', dappId: 'uniswap', isEssentialDapp: 'yes' } ]),
    })).toEqual([ 'NEXT_PUBLIC_DEFI_DROPDOWN_ITEMS[0].isEssentialDapp must be a `boolean` type, but the final value was: `"yes"`.' ]);
  });
});
