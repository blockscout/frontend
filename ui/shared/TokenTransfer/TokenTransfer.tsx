import { Box } from '@chakra-ui/react';
import type { QueryKey } from '@tanstack/react-query';
import { useQuery } from '@tanstack/react-query';
import React from 'react';

import type { TokenTransferResponse } from 'types/api/tokenTransfer';

import DataFetchAlert from 'ui/shared/DataFetchAlert';

interface Props {
  isLoading?: boolean;
  isDisabled?: boolean;
  path: string;
  queryKey: QueryKey;
}

const TokenTransfer = ({ isLoading: isLoadingProp, isDisabled, queryKey, path }: Props) => {
  const { isError, isLoading } = useQuery<unknown, unknown, TokenTransferResponse>(
    queryKey,
    async() => await fetch(path),
    {
      enabled: !isDisabled,
    },
  );

  if (isLoading || isLoadingProp) {
    return <span>Loading...</span>;
  }

  if (isError) {
    return <DataFetchAlert/>;
  }

  return <Box>TokenTransfer</Box>;
};

export default React.memo(TokenTransfer);
