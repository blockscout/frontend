import { Box, chakra, Tooltip } from '@chakra-ui/react';
import React from 'react';
import Jazzicon, { jsNumberForAddress } from 'react-jazzicon';

import type { AddressParam } from 'types/api/addressParams';

import AddressContractIcon from 'ui/shared/address/AddressContractIcon';

type Props = {
  address: Pick<AddressParam, 'hash' | 'is_contract'>;
  className?: string;
}

const AddressIcon = ({ address, className }: Props) => {
  if (address.is_contract) {
    return (
      <AddressContractIcon/>
    );
  }

  return (
    <Tooltip label={ address.implementation_name }>
      <Box className={ className } width="24px" display="inline-flex">
        <Jazzicon diameter={ 24 } seed={ jsNumberForAddress(address.hash) }/>
      </Box>
    </Tooltip>
  );
};

export default chakra(AddressIcon);
