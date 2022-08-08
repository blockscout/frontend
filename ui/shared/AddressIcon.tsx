import { Box } from '@chakra-ui/react';
import React from 'react';
import Jazzicon, { jsNumberForAddress } from 'react-jazzicon';

const AddressIcon = ({ address }: {address: string}) => {
  return (
    <Box width="24px">
      <Jazzicon diameter={ 24 } seed={ jsNumberForAddress(address) }/>
    </Box>
  );
};

export default AddressIcon;
