/* eslint-disable max-len */
import { Box, OrderedList, ListItem, Icon, useColorModeValue, Flex } from '@chakra-ui/react';
import React from 'react';

import txIcon from 'icons/transactions.svg';

import AppErrorTitle from '../AppErrorTitle';

const AppErrorInvalidTxHash = () => {
  const textColor = useColorModeValue('gray.500', 'gray.400');
  const snippet = {
    borderColor: useColorModeValue('blackAlpha.300', 'whiteAlpha.300'),
    iconBg: useColorModeValue('blackAlpha.800', 'whiteAlpha.800'),
    iconColor: useColorModeValue('white', 'black'),
  };

  return (
    <>
      <Box p={ 4 } borderColor={ snippet.borderColor } borderRadius="md" w="230px" borderWidth="1px">
        <Flex alignItems="center" pb={ 4 } borderBottomWidth="1px" borderColor={ snippet.borderColor }>
          <Icon as={ txIcon } boxSize={ 8 } color={ snippet.iconColor } bgColor={ snippet.iconBg } p={ 1 } borderRadius="md"/>
          <Box ml={ 2 }>
            <Box w="125px" h="8px" borderRadius="full" bgColor={ snippet.iconBg }/>
            <Box w="30px" h="8px" borderRadius="full" bgColor={ snippet.borderColor } mt={ 1.5 }/>
          </Box>
        </Flex>
        <Flex justifyContent="space-between" alignItems="center" mt={ 3 }>
          <Flex alignItems="center">
            <Box boxSize={ 5 } borderRadius="full" bgColor={ snippet.borderColor }/>
            <Box w="65px" h="8px" borderRadius="full" bgColor={ snippet.borderColor } ml={ 1.5 }/>
          </Flex>
          <Flex alignItems="center">
            <Box boxSize={ 5 } borderRadius="full" bgColor={ snippet.borderColor }/>
            <Box w="65px" h="8px" borderRadius="full" bgColor={ snippet.borderColor } ml={ 1.5 }/>
          </Flex>
        </Flex>
      </Box>
      <AppErrorTitle title="Sorry, we are unable to locate this transaction hash"/>
      <OrderedList color={ textColor } mt={ 3 } spacing={ 3 }>
        <ListItem>
            If you have just submitted this transaction please wait for at least 30 seconds before refreshing this page.
        </ListItem>
        <ListItem>
            It could still be in the TX Pool of a different node, waiting to be broadcasted.
        </ListItem>
        <ListItem>
            During times when the network is busy (i.e during ICOs) it can take a while for your transaction to propagate through the network and for us to index it.
        </ListItem>
        <ListItem>
            If it still does not show up after 1 hour, please check with your sender/exchange/wallet/transaction provider for additional information.
        </ListItem>
      </OrderedList>
    </>
  );
};

export default AppErrorInvalidTxHash;
