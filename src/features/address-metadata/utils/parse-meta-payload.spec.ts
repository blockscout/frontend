// SPDX-License-Identifier: LicenseRef-Blockscout

import { describe, expect, it } from 'vitest';

import parseMetaPayload from './parse-meta-payload';

describe('parseMetaPayload', () => {
  it('keeps known string fields, including the hidden flag', () => {
    const meta = JSON.stringify({
      appActionButtonText: 'Buy',
      appMarketplaceURL: 'https://example.com/{address}',
      bgColor: '#000',
      hidden: 'true',
    });

    expect(parseMetaPayload(meta)).toEqual({
      appActionButtonText: 'Buy',
      appMarketplaceURL: 'https://example.com/{address}',
      bgColor: '#000',
      hidden: 'true',
    });
  });

  it('drops unknown fields and known fields with non-string values', () => {
    const meta = JSON.stringify({ tagUrl: 'https://example.com', hidden: true, projectName: 'Duck', verifiedDomains: [ 'a' ] });

    expect(parseMetaPayload(meta)).toEqual({ tagUrl: 'https://example.com' });
  });

  it('returns an empty object for an empty JSON object', () => {
    expect(parseMetaPayload('{}')).toEqual({});
  });

  it('returns null for null, invalid JSON, or a non-object payload', () => {
    expect(parseMetaPayload(null)).toBeNull();
    expect(parseMetaPayload('not json')).toBeNull();
    expect(parseMetaPayload('"string"')).toBeNull();
    expect(parseMetaPayload('[]')).toBeNull();
    expect(parseMetaPayload('null')).toBeNull();
  });
});
