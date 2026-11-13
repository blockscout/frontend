// SPDX-License-Identifier: LicenseRef-Blockscout

import { Flex, Text } from '@chakra-ui/react';
import React from 'react';

import useTxQuery from 'src/slices/tx/hooks/useTxQuery';
import { TX } from 'src/slices/tx/stubs/tx';

import getQueryParamString from 'src/shared/router/get-query-param-string';
import { useRouter } from 'src/shared/router/useRouter';

import { copy } from 'src/toolkit/utils/htmlEntities';

import TxReceiptCard from './TxReceiptCard';

const TxReceipt = () => {
  const router = useRouter();
  const hash = getQueryParamString(router.query.hash);

  const txQuery = useTxQuery({ hash, isRpcFallbackEnabled: false });

  // the router changes identity while the navigation is in flight, which would re-run the effect
  const isRedirectingRef = React.useRef(false);

  React.useEffect(() => {
    if (txQuery.isError && !isRedirectingRef.current) {
      isRedirectingRef.current = true;
      router.replace({ pathname: '/tx/[hash]', query: { hash } });
    }
  }, [ txQuery.isError, hash, router ]);

  return (
    <Flex
      minH="100dvh"
      flexDir="column"
      alignItems="center"
      justifyContent="center"
      gap={ 6 }
      px={ 4 }
      py={ 8 }
      bgColor={{ _light: 'blackAlpha.50', _dark: 'whiteAlpha.50' }}
    >
      <TxReceiptCard
        hash={ hash }
        data={ txQuery.data ?? TX }
        isLoading={ txQuery.isPlaceholderData || txQuery.isError }
      />
      <Text textStyle="xs" color="text.secondary" textAlign="center">
        Copyright { copy } Blockscout Limited 2023-{ (new Date()).getFullYear() }
      </Text>
    </Flex>
  );
};

export default TxReceipt;
