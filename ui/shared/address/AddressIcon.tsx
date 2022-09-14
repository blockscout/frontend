import { Box, chakra } from '@chakra-ui/react';
import React from 'react';
import Jazzicon, { jsNumberForAddress } from 'react-jazzicon';

const AddressIcon = ({ hash, className }: {hash: string; className?: string}) => {
  return (
    <Box className={ className } width="24px" display="inline-flex">
      <Jazzicon diameter={ 24 } seed={ jsNumberForAddress(hash) }/>
    </Box>
  );
};

export default chakra(AddressIcon);
