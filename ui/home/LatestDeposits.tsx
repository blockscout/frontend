import { Box, Flex, Text } from '@chakra-ui/react';
import React from 'react';

import type { SocketMessage } from 'lib/socket/types';

import { route } from 'nextjs-routes';

import useApiQuery from 'lib/api/useApiQuery';
import useGradualIncrement from 'lib/hooks/useGradualIncrement';
import useIsMobile from 'lib/hooks/useIsMobile';
import useSocketChannel from 'lib/socket/useSocketChannel';
import useSocketMessage from 'lib/socket/useSocketMessage';
import { L2_DEPOSIT_ITEM } from 'stubs/L2';
import LinkInternal from 'ui/shared/LinkInternal';
import SocketNewItemsNotice from 'ui/shared/SocketNewItemsNotice';

import LatestDepositsItem from './LatestDepositsItem';

const LatestDeposits = () => {
  const isMobile = useIsMobile();
  const itemsCount = isMobile ? 2 : 6;
  const { data, isPlaceholderData, isError } = useApiQuery('homepage_deposits', {
    queryOptions: {
      placeholderData: Array(itemsCount).fill(L2_DEPOSIT_ITEM),
    },
  });

  const [ num, setNum ] = useGradualIncrement(0);
  const [ socketAlert, setSocketAlert ] = React.useState('');

  const handleSocketClose = React.useCallback(() => {
    setSocketAlert('Connection is lost. Please reload page.');
  }, []);

  const handleSocketError = React.useCallback(() => {
    setSocketAlert('An error has occurred while fetching new transactions. Please reload page.');
  }, []);

  const handleNewDepositMessage: SocketMessage.NewDeposits['handler'] = React.useCallback((payload) => {
    setNum(payload.deposits);
  }, [ setNum ]);

  const channel = useSocketChannel({
    topic: 'optimism_deposits:new_deposits',
    onSocketClose: handleSocketClose,
    onSocketError: handleSocketError,
    isDisabled: false,
  });

  useSocketMessage({
    channel,
    event: 'deposits',
    handler: handleNewDepositMessage,
  });

  if (isError) {
    return <Text mt={ 4 }>No data. Please reload page.</Text>;
  }

  if (data) {
    const depositsUrl = route({ pathname: '/l2-deposits' });
    return (
      <>
        <SocketNewItemsNotice borderBottomRadius={ 0 } url={ depositsUrl } num={ num } alert={ socketAlert } type="deposit" isLoading={ isPlaceholderData }/>
        <Box mb={{ base: 3, lg: 4 }}>
          { data.slice(0, itemsCount).map(((item, index) => (
            <LatestDepositsItem
              key={ item.l2_tx_hash + (isPlaceholderData ? index : '') }
              item={ item }
              isLoading={ isPlaceholderData }
            />
          ))) }
        </Box>
        <Flex justifyContent="center">
          <LinkInternal fontSize="sm" href={ depositsUrl }>View all deposits</LinkInternal>
        </Flex>
      </>
    );
  }

  return null;
};

export default LatestDeposits;
