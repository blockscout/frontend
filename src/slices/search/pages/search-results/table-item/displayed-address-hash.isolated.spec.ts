import { describe, expect, it } from 'vitest';
import withEnvs from 'vitest/utils/mockEnvs';

import type * as Utils from './displayed-address-hash';

const HASH = '0xd789a607CEac2f0E14867de4EB15b15C9FFB5859';
const FILECOIN_ROBUST_ADDRESS = 'f410f2hwxz7j5u7z5qr4q5pl5pbdc5lvvxbl6f6wdcii';
const BECH32_PREFIX_ENVS: Array<[ string, string ]> = [
  [ 'NEXT_PUBLIC_VIEWS_ADDRESS_FORMAT', '["bech32","base16"]' ],
  [ 'NEXT_PUBLIC_VIEWS_ADDRESS_BECH_32_PREFIX', 'tom' ],
];

async function getHash(params: Parameters<typeof Utils.getDisplayedAddressHash>[0], envs?: Array<[ string, string ]>) {
  return withEnvs(envs, async() => {
    const { getDisplayedAddressHash } = await import('./displayed-address-hash');
    return getDisplayedAddressHash(params);
  });
}

describe('getDisplayedAddressHash', () => {
  it('prefers the filecoin robust address over any format', async() => {
    expect(await getHash({ hash: HASH, filecoinRobustAddress: FILECOIN_ROBUST_ADDRESS, addressFormat: 'bech32' }, BECH32_PREFIX_ENVS))
      .toBe(FILECOIN_ROBUST_ADDRESS);
  });

  it('encodes the hash as bech32 when that format is selected', async() => {
    expect(await getHash({ hash: HASH, filecoinRobustAddress: null, addressFormat: 'bech32' }, BECH32_PREFIX_ENVS))
      .toMatch(/^tom1[\da-z]{38}$/);
  });

  it('keeps the hex hash in the base format', async() => {
    expect(await getHash({ hash: HASH, filecoinRobustAddress: null, addressFormat: 'base16' }, BECH32_PREFIX_ENVS)).toBe(HASH);
  });

  it('returns nothing when there is neither a hash nor a robust address', async() => {
    expect(await getHash({ hash: undefined, filecoinRobustAddress: undefined, addressFormat: 'bech32' }, BECH32_PREFIX_ENVS)).toBeUndefined();
  });
});
