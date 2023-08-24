import { chakra } from '@chakra-ui/react';
import _omit from 'lodash/omit';
import React from 'react';

import { route } from 'nextjs-routes';

import * as AddressEntity from './AddressEntity';

interface Props extends AddressEntity.EntityProps {
  tokenHash: string;
}

const AddressEntityWithTokenFilter = (props: Props) => {
  const linkProps = _omit(props, [ 'className' ]);
  const partsProps = _omit(props, [ 'className', 'onClick' ]);
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
    <AddressEntity.Container className={ props.className }>
      <AddressEntity.Icon { ...partsProps }/>
      <AddressEntity.Link
        { ...linkProps }
        href={ props.href ?? defaultHref }
      >
        <AddressEntity.Content { ...partsProps }/>
      </AddressEntity.Link>
    </AddressEntity.Container>
  );
};

export default chakra(AddressEntityWithTokenFilter);
