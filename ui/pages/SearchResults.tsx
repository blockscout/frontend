import { Box, chakra, Table, Tbody, Tr, Th, Skeleton } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React from 'react';

import useQueryWithPages from 'lib/hooks/useQueryWithPages';
import useUpdateValueEffect from 'lib/hooks/useUpdateValueEffect';
import SearchResultTableItem from 'ui/searchResults/SearchResultTableItem';
import ActionBar from 'ui/shared/ActionBar';
import DataFetchAlert from 'ui/shared/DataFetchAlert';
import Page from 'ui/shared/Page/Page';
import PageTitle from 'ui/shared/Page/PageTitle';
import Pagination from 'ui/shared/Pagination';
import SkeletonTable from 'ui/shared/skeletons/SkeletonTable';
import { default as Thead } from 'ui/shared/TheadSticky';

// const data = {
//   items: [
//     {
//       address: '0x377c5F2B300B25a534d4639177873b7fEAA56d4B',
//       address_url: '/address/0x377c5F2B300B25a534d4639177873b7fEAA56d4B',
//       name: 'Toms NFT',
//       symbol: 'TNT',
//       token_url: '/token/0x377c5F2B300B25a534d4639177873b7fEAA56d4B',
//       type: 'token' as const,
//     },
//     {
//       address: '0xC35Cc7223B0175245E9964f2E3119c261E8e21F9',
//       address_url: '/address/0xC35Cc7223B0175245E9964f2E3119c261E8e21F9',
//       name: 'TomToken',
//       symbol: 'pdE1B',
//       token_url: '/token/0xC35Cc7223B0175245E9964f2E3119c261E8e21F9',
//       type: 'token' as const,
//     },
//     {
//       block_hash: '0x1af31d7535dded06bab9a88eb40ee2f8d0529a60ab3b8a7be2ba69b008cacbd1',
//       block_number: 8198536,
//       type: 'block' as const,
//       url: '/block/0x1af31d7535dded06bab9a88eb40ee2f8d0529a60ab3b8a7be2ba69b008cacbd1',
//     },
//     {
//       address: '0xb64a30399f7F6b0C154c2E7Af0a3ec7B0A5b131a',
//       name: null,
//       type: 'address' as const,
//       url: '/address/0xb64a30399f7F6b0C154c2E7Af0a3ec7B0A5b131a',
//     },
//     {
//       address: '0xb64a30399f7F6b0C154c2E7Af0a3ec7B0A5b131a',
//       name: 'TomToken',
//       type: 'contract' as const,
//       url: '/address/0xb64a30399f7F6b0C154c2E7Af0a3ec7B0A5b131a',
//     },
//     {
//       tx_hash: '0x349d4025d03c6faec117ee10ac0bce7c7a805dd2cbff7a9f101304d9a8a525dd',
//       type: 'transaction' as const,
//       url: '/tx/0x349d4025d03c6faec117ee10ac0bce7c7a805dd2cbff7a9f101304d9a8a525dd',
//     },
//   ],
//   next_page_params: null,
// };

const SearchResultsPageContent = () => {
  const router = useRouter();
  const searchTerm = String(router.query.q || '');
  const { data, isError, isLoading, pagination, isPaginationVisible, onFilterChange } = useQueryWithPages({
    resourceName: 'search',
    filters: { q: searchTerm },
    options: { enabled: Boolean(searchTerm) },
  });

  useUpdateValueEffect(() => {
    onFilterChange({ q: searchTerm });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, searchTerm);

  const content = (() => {
    if (isError) {
      return <DataFetchAlert/>;
    }

    if (isLoading) {
      return (
        <Box>
          <Skeleton h={ 6 } w="280px" borderRadius="full" mb={ 6 }/>
          <SkeletonTable columns={ [ '33%', '34%', '33%' ] }/>
        </Box>
      );
    }

    const num = pagination.page > 1 ? 50 : data.items.length;
    const text = (
      <Box mb={ isPaginationVisible ? 0 : 6 } lineHeight="32px">
        <span>Found </span>
        <chakra.span fontWeight={ 700 }>{ num }{ data.next_page_params || pagination.page > 1 ? '+' : '' }</chakra.span>
        <span> matching results for </span>
                “<chakra.span fontWeight={ 700 }>{ searchTerm }</chakra.span>”
      </Box>
    );

    return (
      <>
        { isPaginationVisible ? (
          <ActionBar mt={ -6 }>
            { text }
            <Pagination { ...pagination }/>
          </ActionBar>
        ) : text }
        { data.items.length > 0 && (
          <Table variant="simple" size="md" fontWeight={ 500 }>
            <Thead top={ isPaginationVisible ? 80 : 0 }>
              <Tr>
                <Th width="33%">Search Result</Th>
                <Th width="34%">Hash/address</Th>
                <Th width="33%">Category</Th>
              </Tr>
            </Thead>
            <Tbody>
              { data.items.map((item, index) => <SearchResultTableItem key={ index } data={ item }/>) }
            </Tbody>
          </Table>
        ) }
      </>
    );
  })();

  return (
    <Page isSearchPage>
      <PageTitle text="Search results"/>
      { content }
    </Page>
  );
};

export default SearchResultsPageContent;
