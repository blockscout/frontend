import { Box, Divider, Skeleton } from '@chakra-ui/react';
import React from 'react';

import useApiQuery from 'lib/api/useApiQuery';
import DataFetchAlert from 'ui/shared/DataFetchAlert';

import TxAdditionalInfoContent from './TxAdditionalInfoContent';

interface Props {
  hash: string;
}

const TxAdditionalInfoContainer = ({ hash }: Props) => {
  const { data, isError, isPending } = useApiQuery('tx', {
    pathParams: { hash },
    queryOptions: {
      refetchOnMount: false,
    },
  });

  if (isPending) {
    return (
      <Box>
        <Skeleton w="130px" h="24px" borderRadius="full" mb={ 6 }/>
        <Box>
          <Skeleton w="110px" h="16px" borderRadius="full" mb={ 3 }/>
          <Skeleton w="100%" h="16px" borderRadius="full"/>
        </Box>
        <Divider my={ 4 }/>
        <Box>
          <Skeleton w="110px" h="16px" borderRadius="full" mb={ 3 }/>
          <Skeleton w="100%" h="16px" borderRadius="full"/>
        </Box>
        <Divider my={ 4 }/>
        <Box>
          <Skeleton w="110px" h="16px" borderRadius="full" mb={ 3 }/>
          <Skeleton w="100%" h="16px" borderRadius="full"/>
        </Box>
        <Divider my={ 4 }/>
        <Box>
          <Skeleton w="110px" h="16px" borderRadius="full" mb={ 3 }/>
          <Skeleton w="75%" h="16px" borderRadius="full"/>
          <Skeleton w="75%" h="16px" borderRadius="full" mt={ 1 }/>
          <Skeleton w="75%" h="16px" borderRadius="full" mt={ 1 }/>
        </Box>
        <Divider my={ 4 }/>
        <Skeleton w="80px" h="16px" borderRadius="full"/>
      </Box>
    );
  }

  if (isError) {
    return <DataFetchAlert/>;
  }

  return <TxAdditionalInfoContent tx={ data }/>;
};

export default React.memo(TxAdditionalInfoContainer);
