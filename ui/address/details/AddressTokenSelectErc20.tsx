import { MenuItem, Flex, Text, useColorModeValue } from '@chakra-ui/react';
import BigNumber from 'bignumber.js';
import React from 'react';

import type { AddressTokenBalance } from 'types/api/address';

import TokenLogo from 'ui/shared/TokenLogo';

interface Props {
  data: AddressTokenBalance;
}

const AddressTokenSelect = ({ data }: Props) => {
  const tokenDecimals = Number(data.token.decimals) || 18;

  return (
    <MenuItem
      px={ 1 }
      py="10px"
      display="flex"
      flexDir="column"
      rowGap={ 2 }
      borderColor={ useColorModeValue('blackAlpha.200', 'whiteAlpha.200') }
      borderBottomWidth="1px"
      _last={{
        borderBottomWidth: '0px',
      }}
      _hover={{
        bgColor: useColorModeValue('blue.50', 'gray.800'),
      }}
      fontSize="sm"
      isFocusable={ false }
    >
      <Flex alignItems="center" w="100%">
        <TokenLogo hash={ data.token.address } name={ data.token.name } boxSize={ 6 }/>
        <Text fontWeight={ 700 } ml={ 2 }>{ data.token.name }</Text>
        <Text fontWeight={ 700 } ml="auto">$23 463.73</Text>
      </Flex>
      <Flex alignItems="center" justifyContent="space-between" w="100%">
        <Text >{ BigNumber(data.value).dividedBy(10 ** tokenDecimals).dp(2).toFormat() } { data.token.symbol }</Text>
        <Text >@1.001</Text>
      </Flex>
    </MenuItem>
  );
};

export default React.memo(AddressTokenSelect);
