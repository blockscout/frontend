import { Flex, Textarea, Skeleton } from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import React from 'react';

import type { RawTracesResponse } from 'types/api/rawTrace';

import useFetch from 'lib/hooks/useFetch';
import CopyToClipboard from 'ui/shared/CopyToClipboard';
import DataFetchAlert from 'ui/shared/DataFetchAlert';

const TxRawTrace = () => {
  const router = useRouter();
  const fetch = useFetch();

  const { data, isLoading, isError } = useQuery<unknown, unknown, RawTracesResponse>(
    [ 'tx-raw-trace', router.query.id ],
    async() => await fetch(`/api/transactions/${ router.query.id }/raw-trace`),
    {
      enabled: Boolean(router.query.id),
    },
  );

  if (isError) {
    return <DataFetchAlert/>;
  }

  if (isLoading) {
    return (
      <>
        <Flex justifyContent="end" mb={ 2 }>
          <Skeleton w={ 5 } h={ 5 }/>
        </Flex>
        <Skeleton w="100%" h="500px"/>
      </>
    );
  }

  const text = JSON.stringify(data, undefined, 4);

  return (
    <>
      <Flex justifyContent="end" mb={ 2 }>
        <CopyToClipboard text={ text }/>
      </Flex>
      <Textarea
        variant="filledInactive"
        minHeight="500px"
        p={ 4 }
        value={ text }
      />
    </>
  );
};

export default TxRawTrace;
