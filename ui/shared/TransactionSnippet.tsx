import { Icon, useColorModeValue } from '@chakra-ui/react';
import React from 'react';

import transactionIcon from 'icons/transactions.svg';
import Address from 'ui/shared/address/Address';
import AddressLink from 'ui/shared/address/AddressLink';
import CopyToClipboard from 'ui/shared/CopyToClipboard';
import HashStringShortenDynamic from 'ui/shared/HashStringShortenDynamic';

interface Props {
  hash: string;
}

const TransactionSnippet = ({ hash }: Props) => {
  return (
    <Address hash={ hash } maxW="100%">
      <Icon as={ transactionIcon } boxSize={ 6 } color={ useColorModeValue('gray.500', 'gray.400') }/>
      <AddressLink fontWeight="600" type="transaction" ml={ 2 }>
        <HashStringShortenDynamic fontWeight="600"/>
      </AddressLink>
      <CopyToClipboard ml={ 1 }/>
    </Address>
  );
};

export default React.memo(TransactionSnippet);
