import { Text, Box } from '@chakra-ui/react';
import React from 'react';

import Address from 'ui/shared/address/Address';
import AddressIcon from 'ui/shared/address/AddressIcon';
import AddressLink from 'ui/shared/address/AddressLink';
import CopyToClipboard from 'ui/shared/CopyToClipboard';
import HashStringShortenDynamic from 'ui/shared/HashStringShortenDynamic';

interface Props {
  address: string;
  subtitle?: string;
}

const AddressSnippet = ({ address, subtitle }: Props) => {
  return (
    <Box maxW="100%">
      <Address hash={ address }>
        <AddressIcon hash={ address }/>
        <AddressLink fontWeight="600" ml={ 2 }>
          <HashStringShortenDynamic fontWeight="600"/>
        </AddressLink>
        <CopyToClipboard ml={ 1 }/>
      </Address>
      { subtitle && <Text fontSize="sm" variant="secondary" mt={ 0.5 } ml={{ base: 0, lg: 8 }}>{ subtitle }</Text> }
    </Box>
  );
};

export default React.memo(AddressSnippet);
