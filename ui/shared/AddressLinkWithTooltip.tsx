import { Flex, Link } from '@chakra-ui/react';
import type { HTMLChakraProps } from '@chakra-ui/system';
import React from 'react';

import useLink from 'lib/link/useLink';

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
  const link = useLink();

  let url;
  if (type === 'transaction') {
    url = link('tx_index', { id: address });
  } else if (type === 'token') {
    url = link('token_index', { id: address });
  } else {
    url = link('address_index', { id: address });
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
