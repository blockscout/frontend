import React from 'react';

import { HStack, Link, Box, Tooltip } from '@chakra-ui/react';

import AddressWithDots from './AddressWithDots';
import CopyToClipboard from './CopyToClipboard';

const AddressLinkWithTooltip = ({ address }: {address: string}) => {
  return (
    <HStack spacing={ 2 } alignContent="center" overflow="hidden">
      <Link
        href="#"
        overflow="hidden"
        fontWeight={ 600 }
        lineHeight="24px"
      >
        <Tooltip label={ address }>
          <Box overflow="hidden"><AddressWithDots address={ address }/></Box>
        </Tooltip>
      </Link>
      <CopyToClipboard text={ address }/>
    </HStack>
  )
}

export default AddressLinkWithTooltip;
