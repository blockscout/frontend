import { VStack, useColorModeValue } from '@chakra-ui/react';
import React from 'react';

interface Props {
  children: React.ReactNode;
}

const AccountListItemMobile = ({ children }: Props) => {
  return (
    <VStack
      gap={ 4 }
      alignItems="flex-start"
      paddingY={ 6 }
      borderColor={ useColorModeValue('blackAlpha.200', 'whiteAlpha.200') }
      borderTopWidth="1px"
      _last={{
        borderBottomWidth: '1px',
      }}
    >
      { children }
    </VStack>
  );
};

export default AccountListItemMobile;
