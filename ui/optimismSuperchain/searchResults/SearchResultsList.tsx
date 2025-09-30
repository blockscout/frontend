import { Flex } from '@chakra-ui/react';
import React from 'react';

import type * as multichain from '@blockscout/multichain-aggregator-types';

import multichainConfig from 'configs/multichain';
import useIsMobile from 'lib/hooks/useIsMobile';

import SearchResultItemAddress from './items/SearchResultItemAddress';
import SearchResultItemBlock from './items/SearchResultItemBlock';
import SearchResultItemBlockNumber from './items/SearchResultItemBlockNumber';
import SearchResultItemToken from './items/SearchResultItemToken';
import SearchResultItemTx from './items/SearchResultItemTx';
import type { QueryType, SearchQueries } from './utils';

interface Props<T extends QueryType> {
  queryType: T;
  query: SearchQueries[T];
  maxItems?: number;
}

const SearchResultsList = <T extends QueryType>({ queryType, query, maxItems = Infinity }: Props<T>) => {

  const config = multichainConfig();
  const isMobile = useIsMobile();

  return (
    <Flex flexDir="column" textStyle="sm">
      { query.data?.pages?.map((page, index) => (
        <React.Fragment key={ index }>
          { page.items.slice(0, maxItems).map((item) => {

            const chain = 'chain_id' in item ? config?.chains.find((chain) => chain.config.chain.id === item.chain_id) : undefined;

            switch (queryType) {
              case 'tokens':
              case 'nfts': {
                const chain = 'chain_infos' in item ? config?.chains.find((chain) => chain.config.chain.id === Object.keys(item.chain_infos)[0]) : undefined;
                if (!chain) {
                  return null;
                }
                const token = item as multichain.AggregatedTokenInfo;
                return <SearchResultItemToken key={ token.address_hash + chain.config.chain.id } data={ token } chain={ chain } isMobile={ isMobile }/>;
              }
              case 'blockNumbers': {
                if (!chain) {
                  return null;
                }
                const block = item as multichain.ChainBlockNumber;
                return <SearchResultItemBlockNumber key={ block.block_number + String(chain.config.chain.id) } data={ block } chain={ chain }/>;
              }
              case 'blocks': {
                if (!chain) {
                  return null;
                }
                const block = item as multichain.Hash;
                return <SearchResultItemBlock key={ block.hash + chain.config.chain.id } data={ block } chain={ chain }/>;
              }
              case 'transactions': {
                if (!chain) {
                  return null;
                }
                const block = item as multichain.Hash;
                return <SearchResultItemTx key={ block.hash + chain.config.chain.id } data={ block } chain={ chain }/>;
              }
              case 'addresses': {
                const address = item as multichain.GetAddressResponse;
                return <SearchResultItemAddress key={ address.hash } data={ address } isMobile={ isMobile }/>;
              }
              default:
                return null;
            }
          }) }
        </React.Fragment>
      )) }
    </Flex>
  );
};

export default SearchResultsList;
