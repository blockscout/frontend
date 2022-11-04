import { Alert, Show } from '@chakra-ui/react';
import type { QueryKey } from '@tanstack/react-query';
import { useQuery } from '@tanstack/react-query';
import React from 'react';

import { TokenTransfer } from 'types/api/tokenTransfer';
import type { TokenTransferResponse } from 'types/api/tokenTransfer';

import useFetch from 'lib/hooks/useFetch';
import DataFetchAlert from 'ui/shared/DataFetchAlert';
import SkeletonTable from 'ui/shared/SkeletonTable';
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
        <Show below="lg">loading...</Show>
        <Show above="lg">
          <SkeletonTable columns={ [ '44px', '185px', '160px', '25%', '25%', '25%', '25%' ] }/>
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

  const items = data.items.reduce((result, item) => {
    if (Array.isArray(item.total)) {
      item.total.forEach((total) => {
        result.push({ ...item, total });
      });
    } else {
      result.push(item);
    }

    return result;
  }, [] as Array<TokenTransfer>);

  return <TokenTransferTable data={ items } baseAddress={ baseAddress }/>;
};

export default React.memo(TokenTransfer);
