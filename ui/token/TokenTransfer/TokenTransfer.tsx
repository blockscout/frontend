import { Hide, Show, Text } from '@chakra-ui/react';
import type { UseQueryResult } from '@tanstack/react-query';
import React from 'react';

import type { TokenInfo } from 'types/api/tokenInfo';
import type { TokenTransferResponse } from 'types/api/tokenTransfer';

import useIsMobile from 'lib/hooks/useIsMobile';
import ActionBar from 'ui/shared/ActionBar';
import DataFetchAlert from 'ui/shared/DataFetchAlert';
import Pagination from 'ui/shared/Pagination';
import type { Props as PaginationProps } from 'ui/shared/Pagination';
import SkeletonList from 'ui/shared/skeletons/SkeletonList';
import SkeletonTable from 'ui/shared/skeletons/SkeletonTable';
import { flattenTotal } from 'ui/shared/TokenTransfer/helpers';
import TokenTransferList from 'ui/token/TokenTransfer/TokenTransferList';
import TokenTransferTable from 'ui/token/TokenTransfer/TokenTransferTable';

type Props = {
  token: TokenInfo;
  transfersQuery: UseQueryResult<TokenTransferResponse> & {
    pagination: PaginationProps;
    isPaginationVisible: boolean;
  };
}

const TokenTransfer = ({ transfersQuery, token }: Props) => {
  const isMobile = useIsMobile();
  const { isError, isLoading, data, pagination, isPaginationVisible } = transfersQuery;

  const content = (() => {
    if (isLoading) {
      return (
        <>
          <Hide below="lg">
            <SkeletonTable columns={ [ '45%', '15%', '36px', '15%', '25%' ] }
            />
          </Hide>
          <Show below="lg">
            <SkeletonList/>
          </Show>
        </>
      );
    }

    if (isError) {
      return <DataFetchAlert/>;
    }

    if (!data.items?.length) {
      return <Text as="span">There are no token transfers</Text>;
    }

    const items = data.items.reduce(flattenTotal, []);
    return (
      <>
        <Hide below="lg">
          <TokenTransferTable data={ items } top={ 80 } token={ token }/>
        </Hide>
        <Show below="lg">
          <TokenTransferList data={ items }/>
        </Show>
      </>
    );
  })();

  return (
    <>
      { isMobile && isPaginationVisible && (
        <ActionBar mt={ -6 }>
          <Pagination ml="auto" { ...pagination }/>
        </ActionBar>
      ) }
      { content }
    </>
  );
};

export default React.memo(TokenTransfer);
