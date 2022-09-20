import { Flex, useColorModeValue, chakra } from '@chakra-ui/react';
import React from 'react';

interface Props {
  children: React.ReactNode;
  className?: string;
}

const AccountListItemMobile = ({ children, className }: Props) => {
  return (
    <Flex
      rowGap={ 6 }
      alignItems="flex-start"
      flexDirection="column"
      paddingY={ 6 }
      borderColor={ useColorModeValue('blackAlpha.200', 'whiteAlpha.200') }
      borderTopWidth="1px"
      _last={{
        borderBottomWidth: '1px',
      }}
      className={ className }
    >
      { children }
    </Flex>
  );
};

export default chakra(AccountListItemMobile);
