import { Text, Box } from '@chakra-ui/react';
import React from 'react';

import type { AddressParam } from 'types/api/addressParams';

import Address from 'ui/shared/address/Address';
import AddressIcon from 'ui/shared/address/AddressIcon';
import AddressLink from 'ui/shared/address/AddressLink';
import CopyToClipboard from 'ui/shared/CopyToClipboard';

interface Props {
  address: AddressParam;
  subtitle?: string;
  isLoading?: boolean;
}

const AddressSnippet = ({ address, subtitle, isLoading }: Props) => {
  return (
    <Box maxW="100%">
      <Address>
        <AddressIcon address={ address } isLoading={ isLoading }/>
        <AddressLink type="address" hash={ address.hash } fontWeight="600" ml={ 2 } isLoading={ isLoading }/>
        <CopyToClipboard text={ address.hash } ml={ 1 } isLoading={ isLoading }/>
      </Address>
      { subtitle && <Text fontSize="sm" variant="secondary" mt={ 0.5 } ml={ 8 }>{ subtitle }</Text> }
    </Box>
  );
};

export default React.memo(AddressSnippet);
