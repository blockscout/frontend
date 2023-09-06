import { chakra } from '@chakra-ui/react';
import React from 'react';

import { route } from 'nextjs-routes';

import * as AddressEntity from './AddressEntity';

interface Props extends AddressEntity.EntityProps {
  tokenHash: string;
}

const AddressEntityWithTokenFilter = (props: Props) => {
  const defaultHref = route({
    pathname: '/address/[hash]',
    query: {
      ...props.query,
      hash: props.address.hash,
      tab: 'token_transfers',
      token: props.tokenHash,
      scroll_to_tabs: 'true',
    },
  });

  return (
    <AddressEntity.default { ...props } href={ props.href ?? defaultHref }/>
  );
};

export default chakra(AddressEntityWithTokenFilter);
