import { Icon, Skeleton, useColorModeValue } from '@chakra-ui/react';
import React from 'react';

import transactionIcon from 'icons/transactions.svg';
import Address from 'ui/shared/address/Address';
import AddressLink from 'ui/shared/address/AddressLink';
import CopyToClipboard from 'ui/shared/CopyToClipboard';

interface Props {
  hash: string;
  isLoading?: boolean;
}

const TransactionSnippet = ({ hash, isLoading }: Props) => {
  return (
    <Address maxW="100%">
      <Skeleton isLoaded={ !isLoading } boxSize={ 6 } borderRadius="base">
        <Icon as={ transactionIcon } boxSize={ 6 } color={ useColorModeValue('gray.500', 'gray.400') }/>
      </Skeleton>
      <AddressLink hash={ hash } fontWeight="600" type="transaction" ml={ 2 } isLoading={ isLoading }/>
      <CopyToClipboard text={ hash } isLoading={ isLoading }/>
    </Address>
  );
};

export default React.memo(TransactionSnippet);
