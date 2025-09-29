import type * as bens from '@blockscout/bens-types';
import type { QuickSearchResultBlock } from 'types/client/multichain-aggregator';
import type { QuickSearchResultItem } from 'types/client/search';

import useApiQuery from 'lib/api/useApiQuery';

interface Props {
  searchTerm: string;
  enabled: boolean;
}

export default function useSearchMultichain({ searchTerm, enabled }: Props) {
  return useApiQuery<'multichainAggregator:quick_search', unknown, Array<QuickSearchResultItem>>('multichainAggregator:quick_search', {
    queryParams: { q: searchTerm },
    queryOptions: {
      enabled: searchTerm.trim().length > 0 && enabled,
      select: (data) => {
        // TODO @tom2drum search by NFT
        const result: Array<QuickSearchResultItem> = [];

        if (data.block_numbers && data.block_numbers.length > 0) {
          const items: Array<QuickSearchResultBlock> = data.block_numbers.map((item) => ({
            type: 'block' as const,
            block_number: item.block_number.toString(),
            block_hash: undefined,
            chain_id: item.chain_id.toString(),
          }));
          result.push(...items);
        }

        if (data.blocks && data.blocks.length > 0) {
          const items: Array<QuickSearchResultBlock> = data.blocks.map((item) => ({
            type: 'block' as const,
            block_number: undefined,
            block_hash: item.hash,
            chain_id: item.chain_id.toString(),
          }));
          result.push(...items);
        }

        if (data.transactions && data.transactions.length > 0) {
          const items: Array<QuickSearchResultItem> = data.transactions.map((item) => ({
            type: 'transaction' as const,
            transaction_hash: item.hash,
            chain_id: item.chain_id,
          }));
          result.push(...items);
        }

        if (data.addresses && data.addresses.length > 0) {
          const items: Array<QuickSearchResultItem> = data.addresses.map((item) => ({
            type: 'address' as const,
            address_hash: item.hash,
            is_multichain: true,
            chain_infos: item.chain_infos,
          }));
          result.push(...items);
        }

        if (data.tokens && data.tokens.length > 0) {
          const items: Array<QuickSearchResultItem> = data.tokens.map((item) => ({
            type: 'token' as const,
            token_type: 'ERC-20',
            address_hash: item.address,
            name: item.name,
            symbol: item.symbol,
            icon_url: item.icon_url,
            is_smart_contract_verified: item.is_verified_contract,
            chain_id: item.chain_id,
            reputation: null,
          }));
          result.push(...items);
        }

        if (data.domains && data.domains.length > 0) {
          const items: Array<QuickSearchResultItem> = data.domains
            .map((item) => (item.address ? {
              type: 'ens_domain' as const,
              ens_info: {
                address_hash: item.address,
                expiry_date: item.expiry_date,
                name: item.name,
                protocol: item.protocol as bens.ProtocolInfo,
              },
              address_hash: item.address,
            } : undefined))
            .filter((item) => item !== undefined);
          result.push(...items);
        }

        return result;
      },
    },
  });
}
