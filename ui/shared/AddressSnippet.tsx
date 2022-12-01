import { Text, Box } from '@chakra-ui/react';
import React from 'react';

import Address from 'ui/shared/address/Address';
import AddressIcon from 'ui/shared/address/AddressIcon';
import AddressLink from 'ui/shared/address/AddressLink';
import CopyToClipboard from 'ui/shared/CopyToClipboard';

import AddressContractIcon from './address/AddressContractIcon';

interface Props {
  address: string;
  subtitle?: string;
  // temporary solution for custom abis while we don't have address info on account pages
  isContract?: boolean;
}

const AddressSnippet = ({ address, isContract, subtitle }: Props) => {
  return (
    <Box maxW="100%">
      <Address>
        { isContract ? <AddressContractIcon/> : <AddressIcon hash={ address }/> }
        <AddressLink hash={ address } fontWeight="600" ml={ 2 }/>
        <CopyToClipboard text={ address } ml={ 1 }/>
      </Address>
      { subtitle && <Text fontSize="sm" variant="secondary" mt={ 0.5 } ml={ 8 }>{ subtitle }</Text> }
    </Box>
  );
};

export default React.memo(AddressSnippet);
