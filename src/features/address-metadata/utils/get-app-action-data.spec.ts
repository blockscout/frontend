// SPDX-License-Identifier: LicenseRef-Blockscout

import { hiddenProtocolTagWithMeta, nameTag, protocolTag, protocolTagWithMeta } from 'src/features/address-metadata/mocks/tags';

import { describe, expect, it } from 'vitest';
import withEnvs from 'vitest/utils/mockEnvs';

import { getAppActionData } from './get-app-action-data';

const appIdOnlyTag = { ...protocolTagWithMeta, meta: { ...protocolTagWithMeta.meta, appMarketplaceURL: undefined } };
const styledProtocolTag = { ...protocolTag, meta: { textColor: '#FFFFFF' } };

describe('getAppActionData', () => {
  it('takes the first protocol tag that carries an app action, skipping protocol tags without one', () => {
    expect(getAppActionData([ nameTag, protocolTag, styledProtocolTag, hiddenProtocolTagWithMeta ])).toBe(hiddenProtocolTagWithMeta.meta);
  });

  it('ignores an app action on a non-protocol tag', () => {
    expect(getAppActionData([ { ...hiddenProtocolTagWithMeta, tagType: 'generic' } ])).toBeNull();
  });

  it('is null when no tag carries an app action', () => {
    expect(getAppActionData([ nameTag, protocolTag, styledProtocolTag ])).toBeNull();
    expect(getAppActionData(undefined)).toBeNull();
  });

  it('treats an app id as an app action only when the marketplace is enabled', async() => {
    await withEnvs([ [ 'NEXT_PUBLIC_MARKETPLACE_ENABLED', 'true' ] ], async() => {
      const { getAppActionData } = await import('./get-app-action-data');
      expect(getAppActionData([ appIdOnlyTag ])).toBe(appIdOnlyTag.meta);
    });

    await withEnvs([ [ 'NEXT_PUBLIC_MARKETPLACE_ENABLED', 'false' ] ], async() => {
      const { getAppActionData } = await import('./get-app-action-data');
      expect(getAppActionData([ appIdOnlyTag ])).toBeNull();
    });
  });
});
