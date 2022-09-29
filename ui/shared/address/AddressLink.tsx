import { Link, chakra, shouldForwardProp, Tooltip, Box } from '@chakra-ui/react';
import React from 'react';

import useLink from 'lib/link/useLink';
import HashStringShorten from 'ui/shared/HashStringShorten';
import HashStringShortenDynamic from 'ui/shared/HashStringShortenDynamic';

interface Props {
  type?: 'address' | 'transaction' | 'token' | 'block';
  alias?: string;
  className?: string;
  hash: string;
  truncation?: 'constant' | 'dynamic'| 'none';
  fontWeight?: string;
  id?: string;
}

const AddressLink = ({ alias, type, className, truncation = 'dynamic', hash, id, fontWeight }: Props) => {
  const link = useLink();
  let url;
  if (type === 'transaction') {
    url = link('tx_index', { id: id || hash });
  } else if (type === 'token') {
    url = link('token_index', { id: id || hash });
  } else if (type === 'block') {
    url = link('block', { id: id || hash });
  } else {
    url = link('address_index', { id: id || hash });
  }

  const content = (() => {
    if (alias) {
      return (
        <Tooltip label={ hash }>
          <Box overflow="hidden" textOverflow="ellipsis">{ alias }</Box>
        </Tooltip>
      );
    }
    switch (truncation) {
      case 'constant':
        return <HashStringShorten hash={ hash }/>;
      case 'dynamic':
        return <HashStringShortenDynamic hash={ hash } fontWeight={ fontWeight }/>;
      case 'none':
        return <span>{ hash }</span>;
    }
  })();

  return (
    <Link
      className={ className }
      href={ url }
      target="_blank"
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
