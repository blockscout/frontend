import * as searchMock from 'src/slices/search/mocks';

import { ENVS_MAP } from 'src/config/test-utils/env-presets';

import { describe, expect, it } from 'vitest';
import withEnvs from 'vitest/utils/mockEnvs';

import type { Category } from './search-categories';

const NO_ADDITIONAL_TOKEN_TYPES = undefined;

function getTokenCategory(tokenType: string, envs: Array<[ string, string ]> | undefined): Promise<Category | undefined> {
  return withEnvs(envs, async() => {
    const { getItemCategory } = await import('./search-categories');
    return getItemCategory({ ...searchMock.token1, token_type: tokenType });
  });
}

describe('getItemCategory', () => {
  describe('token', () => {
    it.each([
      [ 'ERC-20', 'token' ],
      [ 'ERC-721', 'nft' ],
      [ 'ERC-1155', 'nft' ],
      [ 'ERC-8056', 'nft' ],
      [ 'ERC-7984', 'nft' ],
    ])('%s with no additional token types → %s', async(tokenType, expected) => {
      expect(await getTokenCategory(tokenType, NO_ADDITIONAL_TOKEN_TYPES)).toBe(expected);
    });

    it.each([
      [ 'ERC-20', 'token' ],
      [ 'ERC-721', 'nft' ],
      [ 'ERC-8056', 'token' ],
      [ 'ERC-7984', 'confidential_token' ],
    ])('%s with ERC-7984 and ERC-8056 enabled → %s', async(tokenType, expected) => {
      expect(await getTokenCategory(tokenType, ENVS_MAP.additionalTokenTypes)).toBe(expected);
    });
  });

  it.each([
    [ searchMock.address1, 'address' ],
    [ searchMock.contract1, 'address' ],
    [ searchMock.block1, 'block' ],
    [ searchMock.label1, 'public_tag' ],
    [ searchMock.tx1, 'transaction' ],
  ])('$type → $1', async(item, expected) => {
    const { getItemCategory } = await import('./search-categories');
    expect(getItemCategory(item)).toBe(expected);
  });
});

describe('getSearchCategories', () => {
  async function getFungibleTokensTitle(envs: Array<[ string, string ]> | undefined): Promise<string | undefined> {
    return withEnvs(envs, async() => {
      const { getSearchCategories } = await import('./search-categories');
      return getSearchCategories().find((category) => category.id === 'token')?.title;
    });
  }

  it('names only ERC-20 when there are no additional token types', async() => {
    expect(await getFungibleTokensTitle(NO_ADDITIONAL_TOKEN_TYPES)).toBe('Tokens (ERC-20)');
  });

  it('lists the enabled fungible additional types, leaving confidential ones to their own group', async() => {
    expect(await getFungibleTokensTitle(ENVS_MAP.additionalTokenTypes)).toBe('Tokens (ERC-20, ERC-8056)');
  });
});
