// SPDX-License-Identifier: LicenseRef-Blockscout

import { hiddenProtocolTagWithMeta, nameTag, protocolTag } from 'src/features/address-metadata/mocks/tags';

import { describe, expect, it } from 'vitest';

import { getAppActionData } from './get-app-action-data';

describe('getAppActionData', () => {
  it('takes the first protocol tag that carries an app action, skipping protocol tags without one', () => {
    expect(getAppActionData([ nameTag, protocolTag, hiddenProtocolTagWithMeta ])).toBe(hiddenProtocolTagWithMeta.meta);
  });

  it('ignores an app action on a non-protocol tag', () => {
    expect(getAppActionData([ { ...hiddenProtocolTagWithMeta, tagType: 'generic' } ])).toBeNull();
  });

  it('is null when no tag carries an app action', () => {
    expect(getAppActionData([ nameTag, protocolTag ])).toBeNull();
    expect(getAppActionData(undefined)).toBeNull();
  });
});
