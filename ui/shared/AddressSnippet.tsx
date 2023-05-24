import { Box, Skeleton } from '@chakra-ui/react';
import React from 'react';

import type { AddressParam } from 'types/api/addressParams';

import Address from 'ui/shared/address/Address';
import AddressIcon from 'ui/shared/address/AddressIcon';
import AddressLink from 'ui/shared/address/AddressLink';
import CopyToClipboard from 'ui/shared/CopyToClipboard';

interface Props {
  address: Pick<AddressParam, 'hash' | 'is_contract' | 'implementation_name'>;
  subtitle?: string;
  isLoading?: boolean;
}

const AddressSnippet = ({ address, subtitle, isLoading }: Props) => {
  return (
    <Box maxW="100%">
      <Address>
        <AddressIcon address={ address } isLoading={ isLoading }/>
        <AddressLink type="address" hash={ address.hash } fontWeight="600" ml={ 2 } isLoading={ isLoading }/>
        <CopyToClipboard text={ address.hash } isLoading={ isLoading }/>
      </Address>
      { subtitle && (
        <Skeleton fontSize="sm" color="text_secondary" mt={ 0.5 } ml={ 8 } display="inline-block" isLoaded={ !isLoading }>
          <span>{ subtitle }</span>
        </Skeleton>
      ) }
    </Box>
  );
};

export default React.memo(AddressSnippet);
