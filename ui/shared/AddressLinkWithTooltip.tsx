import React from 'react';

import { HStack, Link } from '@chakra-ui/react';

import AddressWithDots from './AddressWithDots';
import CopyToClipboard from './CopyToClipboard';

const FONT_WEIGHT = '600';

const AddressLinkWithTooltip = ({ address }: {address: string}) => {
  return (
    <HStack spacing={ 2 } alignContent="center" overflow="hidden">
      <Link
        href="#"
        overflow="hidden"
        fontWeight={ FONT_WEIGHT }
        lineHeight="24px"
      >
        <AddressWithDots address={ address } fontWeight={ FONT_WEIGHT }/>
      </Link>
      <CopyToClipboard text={ address }/>
    </HStack>
  );
};

export default React.memo(AddressLinkWithTooltip);
