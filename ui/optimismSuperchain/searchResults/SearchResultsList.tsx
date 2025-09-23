import { Flex } from '@chakra-ui/react';
import React from 'react';

import type * as multichain from '@blockscout/multichain-aggregator-types';

import multichainConfig from 'configs/multichain';

import SearchResultItemAddress from './items/SearchResultItemAddress';
import SearchResultItemBlock from './items/SearchResultItemBlock';
import SearchResultItemBlockNumber from './items/SearchResultItemBlockNumber';
import SearchResultItemToken from './items/SearchResultItemToken';
import SearchResultItemTx from './items/SearchResultItemTx';
import type { QueryType, SearchQueries } from './utils';

interface Props<T extends QueryType> {
  queryType: T;
  query: SearchQueries[T];
}

const SearchResultsList = <T extends QueryType>({ queryType, query }: Props<T>) => {

  const config = multichainConfig();

  return (
    <Flex flexDir="column" textStyle="sm">
      { query.data?.pages?.map((page, index) => (
        <React.Fragment key={ index }>
          { page.items.map((item) => {

            const chain = 'chain_id' in item ? config?.chains.find((chain) => chain.config.chain.id === item.chain_id) : undefined;

            switch (queryType) {
              case 'tokens': {
                if (!chain) {
                  return null;
                }
                const token = item as multichain.Token;
                return <SearchResultItemToken key={ token.address + chain.config.chain.id } data={ token } chain={ chain }/>;
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
                return <SearchResultItemAddress key={ address.hash } data={ address }/>;
              }
              // TODO @tom2drum search by NFT
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
