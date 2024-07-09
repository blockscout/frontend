import { Center, Heading } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React from 'react';

import useApiQuery from 'lib/api/useApiQuery';
import throwOnResourceLoadError from 'lib/errors/throwOnResourceLoadError';
import getQueryParamString from 'lib/router/getQueryParamString';
import ContentLoader from 'ui/shared/ContentLoader';
import TruncatedValue from 'ui/shared/TruncatedValue';

const BlockCountdown = () => {
  const router = useRouter();
  const height = getQueryParamString(router.query.height);

  const { isFetching, isError, error } = useApiQuery('block_countdown', {
    queryParams: {
      module: 'block',
      action: 'getblockcountdown',
      blockno: height,
    },
  });

  if (isFetching) {
    return <Center h="100%"><ContentLoader/></Center>;
  }

  if (isError) {
    throwOnResourceLoadError({ isError, error, resource: 'block_countdown' });
  }

  return (
    <Center h="100%">
      <Heading
        fontSize="32px"
        lineHeight="40px"
        maxW={{ base: '100%', lg: '500px' }}
      >
        <TruncatedValue
          value={ `Block #${ height }` }
          w="100%"
        />
      </Heading>
    </Center>
  );
};

export default React.memo(BlockCountdown);
