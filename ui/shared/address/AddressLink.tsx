import { Link, chakra, shouldForwardProp, Tooltip, Box } from '@chakra-ui/react';
import type { HTMLAttributeAnchorTarget } from 'react';
import React from 'react';

import link from 'lib/link/link';
import HashStringShorten from 'ui/shared/HashStringShorten';
import HashStringShortenDynamic from 'ui/shared/HashStringShortenDynamic';

interface Props {
  type?: 'address' | 'transaction' | 'token' | 'block' | 'token_instance_item';
  alias?: string | null;
  className?: string;
  hash: string;
  truncation?: 'constant' | 'dynamic'| 'none';
  fontWeight?: string;
  id?: string;
  target?: HTMLAttributeAnchorTarget;
}

const AddressLink = ({ alias, type, className, truncation = 'dynamic', hash, id, fontWeight, target = '_self' }: Props) => {
  let url;
  if (type === 'transaction') {
    url = link('tx', { id: id || hash });
  } else if (type === 'token') {
    url = link('token_index', { hash: id || hash });
  } else if (type === 'token_instance_item') {
    url = link('token_instance_item', { hash, id });
  } else if (type === 'block') {
    url = link('block', { id: id || hash });
  } else {
    url = link('address_index', { id: id || hash });
  }

  const content = (() => {
    if (alias) {
      return (
        <Tooltip label={ hash }>
          <Box overflow="hidden" textOverflow="ellipsis" whiteSpace="nowrap">{ alias }</Box>
        </Tooltip>
      );
    }
    switch (truncation) {
      case 'constant':
        return <HashStringShorten hash={ id || hash }/>;
      case 'dynamic':
        return <HashStringShortenDynamic hash={ id || hash } fontWeight={ fontWeight }/>;
      case 'none':
        return <span>{ id || hash }</span>;
    }
  })();

  return (
    <Link
      className={ className }
      href={ url }
      target={ target }
      overflow="hidden"
      whiteSpace="nowrap"
    >
      { content }
    </Link>
  );
};

const AddressLinkChakra = chakra(AddressLink, {
  shouldForwardProp: (prop) => {
    const isChakraProp = !shouldForwardProp(prop);

    // forward fontWeight to the AddressLink since it's needed for underlying HashStringShortenDynamic component
    if (isChakraProp && prop !== 'fontWeight') {
      return false;
    }

    return true;
  },
});

export default React.memo(AddressLinkChakra);
