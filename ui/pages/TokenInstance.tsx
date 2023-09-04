import { Box } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React from 'react';

import type { PaginationParams } from 'ui/shared/pagination/types';
import type { RoutedTab } from 'ui/shared/Tabs/types';

import useApiQuery from 'lib/api/useApiQuery';
import useIsMobile from 'lib/hooks/useIsMobile';
import * as metadata from 'lib/metadata';
import { TOKEN_INSTANCE } from 'stubs/token';
import * as tokenStubs from 'stubs/token';
import { generateListStub } from 'stubs/utils';
import Pagination from 'ui/shared/pagination/Pagination';
import useQueryWithPages from 'ui/shared/pagination/useQueryWithPages';
import RoutedTabs from 'ui/shared/Tabs/RoutedTabs';
import TabsSkeleton from 'ui/shared/Tabs/TabsSkeleton';
import TokenHolders from 'ui/token/TokenHolders/TokenHolders';
import TokenTransfer from 'ui/token/TokenTransfer/TokenTransfer';
import TokenInstanceDetails from 'ui/tokenInstance/TokenInstanceDetails';
import TokenInstanceMetadata from 'ui/tokenInstance/TokenInstanceMetadata';
import TokenInstancePageTitle from 'ui/tokenInstance/TokenInstancePageTitle';

export type TokenTabs = 'token_transfers' | 'holders'

const TokenInstanceContent = () => {
  const router = useRouter();
  const isMobile = useIsMobile();

  const hash = router.query.hash?.toString();
  const id = router.query.id?.toString();
  const tab = router.query.tab?.toString();

  const scrollRef = React.useRef<HTMLDivElement>(null);

  const tokenInstanceQuery = useApiQuery('token_instance', {
    pathParams: { hash, id },
    queryOptions: {
      enabled: Boolean(hash && id),
      placeholderData: TOKEN_INSTANCE,
    },
  });

  const transfersQuery = useQueryWithPages({
    resourceName: 'token_instance_transfers',
    pathParams: { hash, id },
    scrollRef,
    options: {
      enabled: Boolean(hash && id && (!tab || tab === 'token_transfers') && !tokenInstanceQuery.isPlaceholderData && tokenInstanceQuery.data),
      placeholderData: generateListStub<'token_instance_transfers'>(
        tokenInstanceQuery.data?.token.type === 'ERC-1155' ? tokenStubs.TOKEN_TRANSFER_ERC_1155 : tokenStubs.TOKEN_TRANSFER_ERC_721,
        10,
        { next_page_params: null },
      ),
    },
  });

  const shouldFetchHolders = !tokenInstanceQuery.isPlaceholderData && tokenInstanceQuery.data && !tokenInstanceQuery.data.is_unique;

  const holdersQuery = useQueryWithPages({
    resourceName: 'token_instance_holders',
    pathParams: { hash, id },
    scrollRef,
    options: {
      enabled: Boolean(hash && tab === 'holders' && shouldFetchHolders),
      placeholderData: generateListStub<'token_instance_holders'>(tokenStubs.TOKEN_HOLDER, 10, { next_page_params: null }),
    },
  });

  React.useEffect(() => {
    if (tokenInstanceQuery.data && !tokenInstanceQuery.isPlaceholderData) {
      metadata.update(
        { pathname: '/token/[hash]/instance/[id]', query: { hash: tokenInstanceQuery.data.token.address, id: tokenInstanceQuery.data.id } },
        { symbol: tokenInstanceQuery.data.token.symbol ?? '' },
      );
    }
  }, [ tokenInstanceQuery.data, tokenInstanceQuery.isPlaceholderData ]);

  const tabs: Array<RoutedTab> = [
    {
      id: 'token_transfers',
      title: 'Token transfers',
      component: <TokenTransfer transfersQuery={ transfersQuery } tokenId={ id } token={ tokenInstanceQuery.data?.token }/>,
    },
    shouldFetchHolders ?
      { id: 'holders', title: 'Holders', component: <TokenHolders holdersQuery={ holdersQuery } token={ tokenInstanceQuery.data?.token }/> } :
      undefined,
    { id: 'metadata', title: 'Metadata', component: (
      <TokenInstanceMetadata
        data={ tokenInstanceQuery.data?.metadata }
        isPlaceholderData={ tokenInstanceQuery.isPlaceholderData }
      />
    ) },
  ].filter(Boolean);

  if (tokenInstanceQuery.isError) {
    throw Error('Token instance fetch failed', { cause: tokenInstanceQuery.error });
  }

  let pagination: PaginationParams | undefined;

  if (tab === 'token_transfers') {
    pagination = transfersQuery.pagination;
  } else if (tab === 'holders') {
    pagination = holdersQuery.pagination;
  }

  return (
    <>
      <TokenInstancePageTitle
        tokenInstanceQuery={ tokenInstanceQuery }
        hash={ hash }
      />

      <TokenInstanceDetails data={ tokenInstanceQuery?.data } isLoading={ tokenInstanceQuery.isPlaceholderData } scrollRef={ scrollRef }/>

      { /* should stay before tabs to scroll up with pagination */ }
      <Box ref={ scrollRef }></Box>

      { tokenInstanceQuery.isPlaceholderData ? <TabsSkeleton tabs={ tabs }/> : (
        <RoutedTabs
          tabs={ tabs }
          tabListProps={ isMobile ? { mt: 8 } : { mt: 3, py: 5, marginBottom: 0 } }
          rightSlot={ !isMobile && pagination?.isVisible ? <Pagination { ...pagination }/> : null }
          stickyEnabled={ !isMobile }
        />
      ) }
    </>
  );
};

export default React.memo(TokenInstanceContent);
