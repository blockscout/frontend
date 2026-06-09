// SPDX-License-Identifier: LicenseRef-Blockscout

import { uniqBy } from 'es-toolkit';

import type { ReturnType } from 'src/api/hooks/useApiInfiniteQuery';

import multichainConfig from '../../chains-config';

export interface SearchQueries {
  addresses: ReturnType<'multichainAggregator:search_addresses'>;
  tokens: ReturnType<'multichainAggregator:search_tokens'>;
  blockNumbers: ReturnType<'multichainAggregator:search_block_numbers'>;
  blocks: ReturnType<'multichainAggregator:search_blocks'>;
  transactions: ReturnType<'multichainAggregator:search_transactions'>;
  nfts: ReturnType<'multichainAggregator:search_nfts'>;
  domains: ReturnType<'multichainAggregator:search_domains'>;
}

export type QueryType = keyof SearchQueries;

export const getSearchTabName = (queryType: QueryType) => {
  const chainsConfig = multichainConfig();
  const additionalTokenTypes = uniqBy(
    chainsConfig?.chains
      .map((chain) => chain.app_config.slices.token.additionalTypes)
      .flat() || [],
    (item) => item.id,
  ).map((item) => item.name).join(' & ');

  const SEARCH_TABS_NAMES: Record<QueryType, string> = {
    tokens: `Tokens (ERC-20${ additionalTokenTypes ? ` & ${ additionalTokenTypes }` : '' })`,
    nfts: 'NFTs (ERC-721 & ERC-1155)',
    addresses: 'Addresses',
    blockNumbers: 'Block numbers',
    blocks: 'Blocks',
    transactions: 'Transactions',
    domains: 'Names',
  };

  return SEARCH_TABS_NAMES[queryType];
};

export const SEARCH_TABS_IDS: Record<QueryType, string> = {
  addresses: 'addresses',
  tokens: 'tokens',
  blockNumbers: 'block_numbers',
  blocks: 'blocks',
  transactions: 'transactions',
  nfts: 'nfts',
  domains: 'names',
};
