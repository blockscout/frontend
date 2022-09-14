import { Icon, useColorModeValue } from '@chakra-ui/react';
import React from 'react';

import transactionIcon from 'icons/transactions.svg';
import Address from 'ui/shared/address/Address';
import AddressLink from 'ui/shared/address/AddressLink';
import CopyToClipboard from 'ui/shared/CopyToClipboard';

interface Props {
  hash: string;
}

const TransactionSnippet = ({ hash }: Props) => {
  return (
    <Address maxW="100%">
      <Icon as={ transactionIcon } boxSize={ 6 } color={ useColorModeValue('gray.500', 'gray.400') }/>
      <AddressLink hash={ hash } fontWeight="600" type="transaction" ml={ 2 }/>
      <CopyToClipboard text={ hash } ml={ 1 }/>
    </Address>
  );
};

export default React.memo(TransactionSnippet);
