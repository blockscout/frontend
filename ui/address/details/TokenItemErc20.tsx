import { Flex, Text, useColorModeValue } from '@chakra-ui/react';
import BigNumber from 'bignumber.js';
import React from 'react';

import type { AddressTokenBalance } from 'types/api/address';

import getCurrencyValue from 'lib/getCurrencyValue';
import TokenLogo from 'ui/shared/TokenLogo';

interface Props {
  data: AddressTokenBalance;
}

const AddressTokenSelect = ({ data }: Props) => {
  const tokenDecimals = Number(data.token.decimals) || 18;

  const { usd } = getCurrencyValue({
    value: data.value,
    accuracyUsd: 2,
    exchangeRate: data.token.exchange_rate,
  });

  return (
    <Flex
      px={ 1 }
      py="10px"
      display="flex"
      flexDir="column"
      rowGap={ 2 }
      borderColor={ useColorModeValue('blackAlpha.200', 'whiteAlpha.200') }
      borderBottomWidth="1px"
      _hover={{
        bgColor: useColorModeValue('blue.50', 'gray.800'),
      }}
      fontSize="sm"
      cursor="pointer"
    >
      <Flex alignItems="center" w="100%">
        <TokenLogo hash={ data.token.address } name={ data.token.name } boxSize={ 6 }/>
        <Text fontWeight={ 700 } ml={ 2 }>{ data.token.name }</Text>
        { usd && <Text fontWeight={ 700 } ml="auto">${ usd }</Text> }
      </Flex>
      <Flex alignItems="center" justifyContent="space-between" w="100%">
        <Text >{ BigNumber(data.value).dividedBy(10 ** tokenDecimals).dp(2).toFormat() } { data.token.symbol }</Text>
        { data.token.exchange_rate && <Text >@{ data.token.exchange_rate }</Text> }
      </Flex>
    </Flex>
  );
};

export default React.memo(AddressTokenSelect);
