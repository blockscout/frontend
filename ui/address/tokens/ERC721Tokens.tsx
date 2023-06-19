import { Show, Hide } from '@chakra-ui/react';
import React from 'react';

import useIsMobile from 'lib/hooks/useIsMobile';
import ActionBar from 'ui/shared/ActionBar';
import DataListDisplay from 'ui/shared/DataListDisplay';
import Pagination from 'ui/shared/pagination/Pagination';
import type { QueryWithPagesResult } from 'ui/shared/pagination/useQueryWithPages';

import ERC721TokensListItem from './ERC721TokensListItem';
import ERC721TokensTable from './ERC721TokensTable';

type Props = {
  tokensQuery: QueryWithPagesResult<'address_tokens'>;
}

const ERC721Tokens = ({ tokensQuery }: Props) => {
  const isMobile = useIsMobile();

  const { isError, isPlaceholderData, data, pagination } = tokensQuery;

  const actionBar = isMobile && pagination.isVisible && (
    <ActionBar mt={ -6 }>
      <Pagination ml="auto" { ...pagination }/>
    </ActionBar>
  );

  const content = data?.items ? (
    <>
      <Hide below="lg" ssr={ false }><ERC721TokensTable data={ data.items } isLoading={ isPlaceholderData } top={ pagination.isVisible ? 72 : 0 }/></Hide>
      <Show below="lg" ssr={ false }>{ data.items.map((item, index) => (
        <ERC721TokensListItem
          key={ item.token.address + (isPlaceholderData ? index : '') }
          { ...item }
          isLoading={ isPlaceholderData }
        />
      )) }</Show></>
  ) : null;

  return (
    <DataListDisplay
      isError={ isError }
      items={ data?.items }
      emptyText="There are no tokens of selected type."
      content={ content }
      actionBar={ actionBar }
    />
  );

};

export default ERC721Tokens;
