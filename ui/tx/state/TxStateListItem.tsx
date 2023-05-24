import React from 'react';

import type { TxStateChange } from 'types/api/txStateChanges';

import Address from 'ui/shared/address/Address';
import AddressIcon from 'ui/shared/address/AddressIcon';
import AddressLink from 'ui/shared/address/AddressLink';
import ListItemMobileGrid from 'ui/shared/ListItemMobile/ListItemMobileGrid';

import { getStateElements } from './utils';

interface Props {
  data: TxStateChange;
  isLoading?: boolean;
}

const TxStateListItem = ({ data, isLoading }: Props) => {

  const { before, after, change, tag, tokenId } = getStateElements(data, isLoading);

  return (
    <ListItemMobileGrid.Container>

      <ListItemMobileGrid.Label isLoading={ isLoading }>Address</ListItemMobileGrid.Label>
      <ListItemMobileGrid.Value py="3px">
        <Address flexGrow={ 1 } w="100%" alignSelf="center">
          <AddressIcon address={ data.address } isLoading={ isLoading }/>
          <AddressLink type="address" hash={ data.address.hash } ml={ 2 } truncation="constant" mr={ 3 } isLoading={ isLoading }/>
          { tag }
        </Address>
      </ListItemMobileGrid.Value>

      { before && (
        <>
          <ListItemMobileGrid.Label isLoading={ isLoading }>Before</ListItemMobileGrid.Label>
          <ListItemMobileGrid.Value>{ before }</ListItemMobileGrid.Value>
        </>
      ) }

      { after && (
        <>
          <ListItemMobileGrid.Label isLoading={ isLoading }>After</ListItemMobileGrid.Label>
          <ListItemMobileGrid.Value>{ after }</ListItemMobileGrid.Value>
        </>
      ) }

      { change && (
        <>
          <ListItemMobileGrid.Label isLoading={ isLoading }>Change</ListItemMobileGrid.Label>
          <ListItemMobileGrid.Value>{ change }</ListItemMobileGrid.Value>
        </>
      ) }

      { tokenId && (
        <>
          <ListItemMobileGrid.Label isLoading={ isLoading }>Token ID</ListItemMobileGrid.Label>
          <ListItemMobileGrid.Value py="0">{ tokenId }</ListItemMobileGrid.Value>
        </>
      ) }

    </ListItemMobileGrid.Container>
  );
};

export default TxStateListItem;
