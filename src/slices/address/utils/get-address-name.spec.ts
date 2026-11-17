import { withName, withEns, withNameTag, withoutName } from 'src/slices/address/mocks/address-param';

import { it, expect } from 'vitest';

import getAddressName from './get-address-name';

it('prefers the name tag over the ENS domain and the name', () => {
  expect(getAddressName(withNameTag)).toBe('Mrs. Duckie');
});

it('falls back to the ENS domain', () => {
  expect(getAddressName(withEns)).toBe('kitty.kitty.kitty.cat.eth');
});

it('falls back to the name', () => {
  expect(getAddressName(withName)).toBe('ArianeeStore');
});

it('returns nothing for an address with no name of any kind', () => {
  expect(getAddressName(withoutName)).toBeUndefined();
});
