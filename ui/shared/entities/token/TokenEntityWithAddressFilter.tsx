import { chakra } from '@chakra-ui/react';
import React from 'react';

import { route } from 'nextjs-routes';

import * as TokenEntity from './TokenEntity';

interface Props extends TokenEntity.EntityProps {
  addressHash: string;
}

const TokenEntityWithAddressFilter = (props: Props) => {
  const defaultHref = route({
    pathname: '/address/[hash]',
    query: {
      ...props.query,
      hash: props.addressHash,
      tab: 'token_transfers',
      token: props.token.address,
      scroll_to_tabs: 'true',
    },
  });

  return (
    <TokenEntity.default { ...props } href={ props.href ?? defaultHref }/>
  );
};

export default chakra(TokenEntityWithAddressFilter);
