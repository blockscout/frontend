import React from 'react';

import type { TxStateChange } from 'types/api/txStateChanges';

import Address from 'ui/shared/address/Address';
import AddressIcon from 'ui/shared/address/AddressIcon';
import AddressLink from 'ui/shared/address/AddressLink';
import ListItemMobileGrid from 'ui/shared/ListItemMobile/ListItemMobileGrid';

import { getStateElements } from './utils';

interface Props {
  data: TxStateChange;
}

const TxStateListItem = ({ data }: Props) => {

  const { before, after, change, hint, tokenId } = getStateElements(data);

  const items = [
    { name: 'Address', value: (
      <Address flexGrow={ 1 } w="100%">
        <AddressIcon address={ data.address }/>
        <AddressLink type="address" hash={ data.address.hash } ml={ 2 } truncation="constant" mr="auto"/>
        { hint }
      </Address>
    ) },
    { name: 'Before', value: before },
    { name: 'After', value: after },
    { name: 'Change', value: change },
    { name: 'Token ID', value: tokenId },
  ];

  return <ListItemMobileGrid items={ items }/>;
};

export default TxStateListItem;
