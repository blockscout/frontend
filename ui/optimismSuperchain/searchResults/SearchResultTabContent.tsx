import React from 'react';

import { ContentLoader } from 'toolkit/components/loaders/ContentLoader';
import EmptySearchResult from 'ui/shared/EmptySearchResult';

import SearchResultsList from './SearchResultsList';
import SearchResultsTabAll from './SearchResultsTabAll';
import type { QueryType, SearchQueries } from './utils';

const EMPTY_SEARCH_NAME_MAP: Record<QueryType, string> = {
  addresses: 'addresses',
  tokens: 'tokens',
  blockNumbers: 'block numbers',
  blocks: 'blocks',
  transactions: 'transactions',
  nfts: 'NFTs',
  domains: 'names',
};

interface Props {
  isLoading: boolean;
  searchTerm: string;
  queries: SearchQueries;
  queryType: QueryType | undefined;
  beforeContent?: React.ReactNode;
}

const SearchResultTabContent = ({ isLoading, searchTerm, queries, queryType, beforeContent }: Props) => {
  const content = (() => {
    if (isLoading) {
      return <ContentLoader maxW="240px"/>;
    }

    if (!searchTerm) {
      return (
        <EmptySearchResult
          title="Looking for something?"
          text="Try searching by address, smart contract, transaction, block, token or NFT"
        />
      );
    }

    const hasResults = queryType ?
      queries[queryType]?.data?.pages?.[0]?.items && queries[queryType]?.data?.pages?.[0]?.items?.length > 0 :
      Object.values(queries).some((query) => query.data?.pages?.[0]?.items?.length > 0);

    if (!hasResults) {
      return (
        <EmptySearchResult
          title={ queryType ? `No ${ EMPTY_SEARCH_NAME_MAP[queryType] } found` : 'No results found' }
          text="It seems we can't find any results based on your request."
        />
      );
    }

    switch (queryType) {
      case 'addresses':
      case 'blocks':
      case 'blockNumbers':
      case 'transactions':
      case 'tokens':
      case 'nfts':
      case 'domains':
        return <SearchResultsList queryType={ queryType } query={ queries[queryType] }/>;
      default:
        return <SearchResultsTabAll queries={ queries }/>;
    }
  })();

  return (
    <>
      { beforeContent }
      { content }
    </>
  );
};

export default React.memo(SearchResultTabContent);
