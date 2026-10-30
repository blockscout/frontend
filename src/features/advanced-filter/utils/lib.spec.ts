// SPDX-License-Identifier: LicenseRef-Blockscout

import { describe, expect, it } from 'vitest';

import { getFilterTags } from './lib';

const ADDRESS_FROM = '0x7aC52f69655b2045A0212300a1d26360c7aC0E4b';
const ADDRESS_TO = '0x1234567890abcdef1234567890abcdef12345678';
const TOKEN_ADDRESS = '0x514910771AF9Ca656af840dff83E8264EcF986CA';

describe('getFilterTags', () => {
  it('returns no tags when no filter is set', () => {
    expect(getFilterTags({})).toEqual([]);
  });

  it('middle-truncates address hashes and joins several with a comma', () => {
    const tags = getFilterTags({
      from_address_hashes_to_include: [ ADDRESS_FROM, ADDRESS_TO ],
      to_address_hashes_to_exclude: [ ADDRESS_TO ],
    });

    expect(tags).toEqual([
      { key: 'from_address_hashes_to_include', name: 'From', value: '0x7a...0E4b, 0x12...5678' },
      { key: 'to_address_hashes_to_exclude', name: 'To Exc', value: '0x12...5678' },
    ]);
  });

  it('shows token symbols instead of contract addresses when the symbols are known', () => {
    const tags = getFilterTags({
      token_contract_address_hashes_to_include: [ TOKEN_ADDRESS, 'native' ],
      token_contract_symbols_to_include: [ 'LINK', 'ETH' ],
    });

    expect(tags).toEqual([
      { key: 'token_contract_address_hashes_to_include', name: 'Asset', value: 'LINK, ETH' },
    ]);
  });

  it('falls back to the method id when its name is unknown', () => {
    const tags = getFilterTags({
      methods: [ '0xa9059cbb', '0x095ea7b3' ],
      methods_names: [ 'transfer', '' ],
    });

    expect(tags).toEqual([
      { key: 'methods', name: 'Methods', value: 'transfer, 0x095ea7b3' },
    ]);
  });

  it('maps transaction type ids to their display names', () => {
    const tags = getFilterTags({ transaction_types: [ 'coin_transfer', 'contract_creation' ] });

    expect(tags).toEqual([
      { key: 'transaction_types', name: 'Type', value: 'Coin Transfer, Contract Creation' },
    ]);
  });

  it('hides the date range when a preset age is set', () => {
    const tags = getFilterTags({ age: '7d', age_from: '2024-01-01', age_to: '2024-01-07' });

    expect(tags).toEqual([
      { key: 'age', name: 'Age', value: '7d' },
    ]);
  });

  it('formats the date range as dates when no preset age is set', () => {
    const tags = getFilterTags({ age_from: '2024-01-01T10:00:00Z', age_to: '2024-01-07T10:00:00Z' });

    expect(tags).toEqual([
      { key: 'age_from', name: 'Date from', value: '2024-01-01' },
      { key: 'age_to', name: 'Date to', value: '2024-01-07' },
    ]);
  });

  it('never shows the address relation as a tag', () => {
    expect(getFilterTags({ address_relation: 'and' })).toEqual([]);
  });
});
