import { Text, Box } from '@chakra-ui/react';
import React from 'react';

import type { AddressParam } from 'types/api/addressParams';

import Address from 'ui/shared/address/Address';
import AddressIcon from 'ui/shared/address/AddressIcon';
import AddressLink from 'ui/shared/address/AddressLink';
import CopyToClipboard from 'ui/shared/CopyToClipboard';

interface Props {
  address: Pick<AddressParam, 'hash' | 'is_contract' | 'implementation_name'>;
  subtitle?: string;
}

const AddressSnippet = ({ address, subtitle }: Props) => {
  return (
    <Box maxW="100%">
      <Address>
        <AddressIcon address={ address }/>
        <AddressLink type="address" hash={ address.hash } fontWeight="600" ml={ 2 }/>
        <CopyToClipboard text={ address.hash } ml={ 1 }/>
      </Address>
      { subtitle && <Text fontSize="sm" variant="secondary" mt={ 0.5 } ml={ 8 }>{ subtitle }</Text> }
    </Box>
  );
};

export default React.memo(AddressSnippet);
