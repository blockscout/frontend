// SPDX-License-Identifier: LicenseRef-Blockscout

import { hiddenProtocolTagWithMeta, nameTag, protocolTag, protocolTagWithMeta } from 'src/features/address-metadata/mocks/tags';

import { describe, expect, it } from 'vitest';

import { getVisibleProtocolTags } from './get-visible-protocol-tags';

describe('getVisibleProtocolTags', () => {
  it('keeps the protocol tags that are not hidden, in order', () => {
    expect(getVisibleProtocolTags([ hiddenProtocolTagWithMeta, nameTag, protocolTagWithMeta, protocolTag ]))
      .toEqual([ protocolTagWithMeta, protocolTag ]);
  });

  it('is empty when there is no visible protocol tag', () => {
    expect(getVisibleProtocolTags([ hiddenProtocolTagWithMeta, nameTag ])).toEqual([]);
    expect(getVisibleProtocolTags(undefined)).toEqual([]);
  });
});
