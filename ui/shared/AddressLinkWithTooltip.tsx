import { Flex, Link } from '@chakra-ui/react';
import type { HTMLChakraProps } from '@chakra-ui/system';
import React from 'react';

import useBasePath from 'lib/hooks/useBasePath';

import AddressWithDots from './AddressWithDots';
import CopyToClipboard from './CopyToClipboard';

const FONT_WEIGHT = '600';

interface Props extends HTMLChakraProps<'div'> {
  address: string;
  type?: 'address' | 'transaction' | 'token';
  fontWeight?: string;
  truncated?: boolean;
  withCopy?: boolean;
}

const AddressLinkWithTooltip = ({ address, type = 'address', truncated, withCopy = true, ...styles }: Props) => {
  const basePath = useBasePath();
  let url;
  if (type === 'transaction') {
    url = basePath + '/tx/' + address;
  } else if (type === 'token') {
    url = basePath + '/address/' + address + '/tokens#address-tabs';
  } else {
    url = basePath + '/address/' + address;
  }
  return (
    <Flex columnGap={ 2 } alignItems="center" overflow="hidden" maxW="100%" { ...styles }>
      <Link
        href={ url }
        target="_blank"
        overflow="hidden"
        fontWeight={ styles.fontWeight || FONT_WEIGHT }
        lineHeight="24px"
        whiteSpace="nowrap"
      >
        <AddressWithDots address={ address } fontWeight={ styles.fontWeight || FONT_WEIGHT } truncated={ truncated }/>
      </Link>
      { withCopy && <CopyToClipboard text={ address }/> }
    </Flex>
  );
};

export default React.memo(AddressLinkWithTooltip);
