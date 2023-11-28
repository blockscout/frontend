import { Flex, useColorModeValue } from '@chakra-ui/react';
import React from 'react';

import { walletsMeta } from 'lib/contexts/ylide/constants';
import shortenString from 'lib/shortenString';

interface WalletTagProps {
  wallet: string;
  address?: string;
}

export function WalletTag({ wallet, address }: WalletTagProps) {
  const borderColor = useColorModeValue('blackAlpha.400', 'whiteAlpha.400');
  return (
    <Flex
      marginBottom={ 6 }
      alignItems="center"
      border="1px solid"
      borderColor={ borderColor }
      borderRadius="22px"
      display="flex"
      flexDirection="row"
      justifyContent="center"
      px={ 3 }
      py={ 1 }
    >
      <Flex
        alignItems="center"
        flexDirection="row"
        justifyContent="flex-start"
        marginRight={ 2 }
      >{ walletsMeta[wallet].logo(20) }</Flex>
      <Flex
        fontSize={ 14 }
        fontStyle="normal"
        fontWeight={ 300 }
        lineHeight="100%"
        alignItems="center"
        flexDirection="row"
        justifyContent="flex-start"
      >{ walletsMeta[wallet].title }</Flex>
      { Boolean(address) && (
        <Flex
          alignItems="center"
          flexDirection="row"
          justifyContent="flex-start"
          marginLeft={ 2 }
          maxWidth="105px"
          width="105px"
        >
          <span>{ shortenString(address || null) }</span>
        </Flex>
      ) }
    </Flex>
  );
}
