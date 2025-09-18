import type * as multichain from '@blockscout/multichain-aggregator-types';
import type { TokenType } from 'types/api/token';

// ts-proto generates the wrong token types for AggregatedTokenInfo
// moreover, the default values of the fields (= undefined) cannot be stripped off from the generated types
// so we need to manually re-define the type to match it with core API token info type
export interface AggregatedTokenInfo extends Pick<multichain.AggregatedTokenInfo, 'chain_infos' | 'address_hash'> {
  type: TokenType;
  circulating_market_cap: string | null;
  decimals: string | null;
  holders_count: string | null;
  name: string | null;
  symbol: string | null;
  total_supply: string | null;
  exchange_rate: string | null;
  icon_url: string | null;
}

export interface AddressTokenItem extends Omit<multichain.ListAddressTokensResponse_AggregatedTokenBalanceInfo, 'token' | 'token_id'> {
  token: AggregatedTokenInfo;
  token_id: string | null;
  token_instance: null;
}

export interface AddressTokensResponse extends Omit<multichain.ListAddressTokensResponse, 'items'> {
  items: Array<AddressTokenItem>;
}

export interface TokensResponse extends Omit<multichain.ListClusterTokensResponse, 'items'> {
  items: Array<AggregatedTokenInfo>;
}
