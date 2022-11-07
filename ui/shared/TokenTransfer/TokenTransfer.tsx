import { Alert, Hide, Show } from '@chakra-ui/react';
import type { QueryKey } from '@tanstack/react-query';
import { useQuery } from '@tanstack/react-query';
import React from 'react';

import type { TokenTransferResponse } from 'types/api/tokenTransfer';

import useFetch from 'lib/hooks/useFetch';
import DataFetchAlert from 'ui/shared/DataFetchAlert';
import SkeletonTable from 'ui/shared/SkeletonTable';
import { flattenTotal } from 'ui/shared/TokenTransfer/helpers';
import TokenTransferList from 'ui/shared/TokenTransfer/TokenTransferList';
import TokenTransferSkeletonMobile from 'ui/shared/TokenTransfer/TokenTransferSkeletonMobile';
import TokenTransferTable from 'ui/shared/TokenTransfer/TokenTransferTable';

interface Props {
  isLoading?: boolean;
  isDisabled?: boolean;
  path: string;
  queryKey: QueryKey;
  baseAddress?: string;
}

const TokenTransfer = ({ isLoading: isLoadingProp, isDisabled, queryKey, path, baseAddress }: Props) => {
  const fetch = useFetch();
  const { isError, isLoading, data } = useQuery<unknown, unknown, TokenTransferResponse>(
    queryKey,
    async() => await fetch(path),
    {
      enabled: !isDisabled,
    },
  );

  if (isLoading || isLoadingProp) {
    return (
      <>
        <Hide below="lg">
          <SkeletonTable columns={ [ '44px', '185px', '160px', '25%', '25%', '25%', '25%' ] }/>
        </Hide>
        <Show below="lg">
          <TokenTransferSkeletonMobile/>
        </Show>
      </>
    );
  }

  if (isError) {
    return <DataFetchAlert/>;
  }

  if (!data.items?.length) {
    return <Alert>There are no token transfers</Alert>;
  }

  const items = data.items.reduce(flattenTotal, []);

  return (
    <>
      <Hide below="lg">
        <TokenTransferTable data={ items } baseAddress={ baseAddress }/>
      </Hide>
      <Show below="lg">
        <TokenTransferList data={ items } baseAddress={ baseAddress }/>
      </Show>
    </>
  );
};

export default React.memo(TokenTransfer);
