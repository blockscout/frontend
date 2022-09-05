import { Box, HStack, Icon, useColorModeValue } from '@chakra-ui/react';
import React from 'react';

import transactionIcon from 'icons/transactions.svg';
import AddressLinkWithTooltip from 'ui/shared/AddressLinkWithTooltip';

interface Props {
  hash: string;
}

const TransactionSnippet = ({ hash }: Props) => {
  return (
    <HStack spacing={ 2 } overflow="hidden" alignItems="start" maxW="100%">
      <Icon as={ transactionIcon } boxSize={ 6 } color={ useColorModeValue('gray.500', 'gray.400') }/>
      <Box overflow="hidden">
        <AddressLinkWithTooltip address={ hash } type="transaction"/>
      </Box>
    </HStack>
  );
};

export default React.memo(TransactionSnippet);
