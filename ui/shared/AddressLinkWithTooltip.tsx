import { HStack, Link } from '@chakra-ui/react';
import React from 'react';

import useBasePath from 'lib/hooks/useBasePath';

import AddressWithDots from './AddressWithDots';
import CopyToClipboard from './CopyToClipboard';

const FONT_WEIGHT = '600';

type Props = {
  address: string;
  type?: 'address' | 'transaction';
}

const AddressLinkWithTooltip = ({ address, type = 'address' }: Props) => {
  const basePath = useBasePath();
  let url;
  if (type === 'transaction') {
    url = basePath + '/tx/' + address;
  } else {
    url = basePath + '/address/' + address + '/tokens#address-tabs';
  }
  return (
    <HStack spacing={ 2 } alignContent="center" overflow="hidden" maxW="100%">
      <Link
        href={ url }
        target="_blank"
        overflow="hidden"
        fontWeight={ FONT_WEIGHT }
        lineHeight="24px"
        whiteSpace="nowrap"
      >
        <AddressWithDots address={ address } fontWeight={ FONT_WEIGHT }/>
      </Link>
      <CopyToClipboard text={ address }/>
    </HStack>
  );
};

export default React.memo(AddressLinkWithTooltip);
