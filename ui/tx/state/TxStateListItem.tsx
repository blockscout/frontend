import React from 'react';

import type { TxStateChange } from 'types/api/txStateChanges';

import AddressEntity from 'ui/shared/entities/address/AddressEntity';
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
      <ListItemMobileGrid.Value py="3px" display="flex" flexWrap="nowrap" columnGap={ 3 }>
        <AddressEntity
          address={ data.address }
          isLoading={ isLoading }
          truncation="constant"
        />
        { tag }
      </ListItemMobileGrid.Value>

      { before && (
        <>
          <ListItemMobileGrid.Label isLoading={ isLoading }>Before</ListItemMobileGrid.Label>
          <ListItemMobileGrid.Value fontFamily="var(--kda-typography-family-monospace-font)">{ before }</ListItemMobileGrid.Value>
        </>
      ) }

      { after && (
        <>
          <ListItemMobileGrid.Label isLoading={ isLoading }>After</ListItemMobileGrid.Label>
          <ListItemMobileGrid.Value fontFamily="var(--kda-typography-family-monospace-font)">{ after }</ListItemMobileGrid.Value>
        </>
      ) }

      { change && (
        <>
          <ListItemMobileGrid.Label isLoading={ isLoading }>Change</ListItemMobileGrid.Label>
          <ListItemMobileGrid.Value fontFamily="var(--kda-typography-family-monospace-font)">{ change }</ListItemMobileGrid.Value>
        </>
      ) }

      { tokenId && (
        <>
          <ListItemMobileGrid.Label isLoading={ isLoading }>Token ID</ListItemMobileGrid.Label>
          <ListItemMobileGrid.Value py="0" fontFamily="var(--kda-typography-family-monospace-font)">{ tokenId }</ListItemMobileGrid.Value>
        </>
      ) }

    </ListItemMobileGrid.Container>
  );
};

export default TxStateListItem;
