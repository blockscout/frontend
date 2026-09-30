import type { GetBridgedTokensResponse, StatsBridgedTokenRow } from '@blockscout/interchain-indexer-types';
import { TokenInfo_TokenType } from '@blockscout/interchain-indexer-types';

import { chainB, homeChain } from './chains';

export const bridgedTokenErc20 = {
  stats_asset_id: '1',
  name: 'Gnosis Token',
  symbol: 'GNO',
  icon_url: 'https://example.com/gno.png',
  input_transfers_count: 4906,
  output_transfers_count: 6908,
  total_transfers_count: 11814,
  tokens: [
    {
      chain_id: homeChain.id,
      token_address: '0x9c58bacc331c9aa871afd802db6379a98e80cedb',
      name: 'Gnosis Token on xDai',
      symbol: 'GNO',
      icon_url: 'https://example.com/gno.png',
      decimals: 18,
      type: TokenInfo_TokenType.ERC20,
    },
    {
      chain_id: chainB.id,
      token_address: '0x6810e776880c02933d47db1b9fc05908e5386b96',
      name: 'Gnosis Token',
      symbol: 'GNO',
      icon_url: 'https://example.com/gno.png',
      decimals: 18,
      type: TokenInfo_TokenType.ERC20,
    },
  ],
} satisfies StatsBridgedTokenRow;

export const bridgedTokenNative = {
  stats_asset_id: '412',
  name: 'xDai',
  symbol: 'xDAI',
  icon_url: undefined,
  input_transfers_count: 1627,
  output_transfers_count: 1125,
  total_transfers_count: 2752,
  tokens: [
    {
      chain_id: homeChain.id,
      token_address: undefined,
      name: 'xDai',
      symbol: 'xDAI',
      icon_url: undefined,
      decimals: 18,
      type: TokenInfo_TokenType.NATIVE,
    },
  ],
} satisfies StatsBridgedTokenRow;

export const listResponse = {
  items: [
    bridgedTokenErc20,
    bridgedTokenNative,
  ],
  next_page_params: undefined,
  prev_page_params: undefined,
} satisfies GetBridgedTokensResponse;
