// SPDX-License-Identifier: LicenseRef-Blockscout

import type { schemas } from '@blockscout/api-types';

import * as addressMock from 'src/slices/address/mocks/address';

import { noteTag, tagWithTooltip } from 'src/features/address-metadata/mocks/tags';

import { describe, it, expect } from 'vitest';
import withEnvs from 'vitest/utils/mockEnvs';

import type { AddressPageTagsParams } from './get-address-page-tags';

const CELO_ACCOUNT: NonNullable<NonNullable<schemas['AddressResponse']['celo']>['account']> = {
  name: null,
  type: 'regular',
  locked_celo: '0',
  metadata_url: null,
  nonvoting_locked_celo: '0',
  vote_signer_address: null,
  validator_signer_address: null,
  attestation_signer_address: null,
};

const DEFAULT_PARAMS: AddressPageTagsParams = {
  addressData: undefined,
  isSafeAddress: false,
  hasUserOpsAccount: false,
  usernameApiTag: undefined,
  metadataTags: undefined,
  xStarLevel: undefined,
};

const USERNAME_TAG_ENVS: Array<[ string, string ]> = [
  [ 'NEXT_PUBLIC_ADDRESS_USERNAME_TAG', JSON.stringify({
    api_url_template: 'https://example.com/{address}',
    tag_link_template: 'https://example.com/u/{username}',
    tag_icon: 'icon.svg',
    tag_bg_color: 'blue.100',
    tag_text_color: 'blue.900',
  }) ],
];

const XSTAR_ENVS: Array<[ string, string ]> = [ [ 'NEXT_PUBLIC_XSTAR_SCORE_URL', 'https://xstar.example' ] ];
const USER_OPS_ENVS: Array<[ string, string ]> = [ [ 'NEXT_PUBLIC_HAS_USER_OPS', 'true' ] ];
const VALIDATORS_ENVS: Array<[ string, string ]> = [ [ 'NEXT_PUBLIC_VALIDATORS_CHAIN_TYPE', 'stability' ] ];

async function getTagSlugs(envs: Array<[ string, string ]>, params: Partial<AddressPageTagsParams>): Promise<Array<string>> {
  return withEnvs(envs, async() => {
    const { getAddressPageTags } = await import('./get-address-page-tags');
    return getAddressPageTags({ ...DEFAULT_PARAMS, ...params }).map((tag) => tag.slug);
  });
}

describe('getAddressPageTags', () => {
  it('marks a plain account as EOA', async() => {
    expect(await getTagSlugs([], { addressData: addressMock.validator })).toEqual([ 'eoa' ]);
  });

  it('marks a proxy contract and keeps the account and watchlist tags after it', async() => {
    expect(await getTagSlugs([], { addressData: addressMock.contract })).toEqual([ 'some-public-tag', 'watchlist-name', 'proxy', 'my-private-tag' ]);
  });

  it('marks a delegated account as EOA+code instead of a proxy', async() => {
    const addressData: schemas['AddressResponse'] = {
      ...addressMock.validator,
      implementations: addressMock.contract.implementations,
      proxy_type: 'eip7702',
    };
    expect(await getTagSlugs([], { addressData })).toEqual([ 'eoa', 'eip7702' ]);
  });

  it('marks a token contract', async() => {
    expect(await getTagSlugs([], { addressData: addressMock.token })).toEqual([ 'token' ]);
  });

  it('marks a validator only when the chain has validators', async() => {
    expect(await getTagSlugs([], { addressData: addressMock.validator })).not.toContain('validator');
    expect(await getTagSlugs(VALIDATORS_ENVS, { addressData: addressMock.validator })).toEqual([ 'eoa', 'validator' ]);
  });

  it('marks a celo account with its own colors', async() => {
    const addressData: schemas['AddressResponse'] = { ...addressMock.validator, celo: { account: CELO_ACCOUNT } };
    expect(await getTagSlugs([], { addressData })).toEqual([ 'celo-account', 'eoa' ]);
  });

  it('puts the safe tag last', async() => {
    const slugs = await getTagSlugs([], { addressData: addressMock.contract, isSafeAddress: true });
    expect(slugs).toEqual([ 'some-public-tag', 'watchlist-name', 'proxy', 'my-private-tag', 'safe' ]);
  });

  it('attaches the FHE explanation to a public fhe tag', async() => {
    const fheTag: schemas['Tag'] = { label: 'FHE', display_name: 'FHE', address_hash: addressMock.token.hash };
    const addressData: schemas['AddressResponse'] = { ...addressMock.token, public_tags: [ fheTag ] };
    const tags = await withEnvs([], async() => {
      const { getAddressPageTags } = await import('./get-address-page-tags');
      return getAddressPageTags({ ...DEFAULT_PARAMS, addressData });
    });

    expect(tags.find((tag) => tag.slug === 'FHE')).toMatchObject({ meta: { tooltipDescription: expect.stringContaining('Fully Homomorphic Encryption') } });
  });

  it('adds the smart contract wallet tag only when user ops are on', async() => {
    expect(await getTagSlugs([], { addressData: addressMock.token, hasUserOpsAccount: true })).toEqual([ 'token' ]);
    expect(await getTagSlugs(USER_OPS_ENVS, { addressData: addressMock.token, hasUserOpsAccount: true })).toEqual([ 'token', 'user_ops_acc' ]);
  });

  it('links the username tag through the profile template', async() => {
    const tags = await withEnvs(USERNAME_TAG_ENVS, async() => {
      const { getAddressPageTags } = await import('./get-address-page-tags');
      return getAddressPageTags({ ...DEFAULT_PARAMS, addressData: addressMock.token, usernameApiTag: 'alice' });
    });

    expect(tags.map((tag) => tag.slug)).toEqual([ 'token', 'username_api' ]);
    expect(tags[1]).toMatchObject({ name: 'alice', meta: { tagUrl: 'https://example.com/u/alice', tagIcon: 'icon.svg' } });
  });

  it('skips the username tag when the profile API is off', async() => {
    expect(await getTagSlugs([], { addressData: addressMock.token, usernameApiTag: 'alice' })).toEqual([ 'token' ]);
  });

  it('shows the XStar level for an account but never for a contract', async() => {
    expect(await getTagSlugs(XSTAR_ENVS, { addressData: addressMock.validator, xStarLevel: '3' })).toEqual([ 'eoa', 'xstar' ]);
    expect(await getTagSlugs(XSTAR_ENVS, { addressData: addressMock.token, xStarLevel: '3' })).toEqual([ 'token' ]);
    expect(await getTagSlugs([], { addressData: addressMock.validator, xStarLevel: '3' })).toEqual([ 'eoa' ]);
  });

  it('keeps metadata tags except notes', async() => {
    expect(await getTagSlugs([], { addressData: addressMock.token, metadataTags: [ tagWithTooltip, noteTag ] })).toEqual([ 'token', tagWithTooltip.slug ]);
  });
});
