import { Grid, GridItem } from '@chakra-ui/react';
import React from 'react';

import type { TxStateChange } from 'types/api/txStateChanges';

import Address from 'ui/shared/address/Address';
import AddressIcon from 'ui/shared/address/AddressIcon';
import AddressLink from 'ui/shared/address/AddressLink';
import ListItemMobile from 'ui/shared/ListItemMobile/ListItemMobile';

import { getStateElements } from './utils';

interface Props {
  data: TxStateChange;
}

const TxStateListItem = ({ data }: Props) => {

  const { before, after, change, hint, tokenId } = getStateElements(data);

  return (
    <ListItemMobile>
      <Address flexGrow={ 1 } w="100%">
        <AddressIcon address={ data.address }/>
        <AddressLink type="address" hash={ data.address.hash } ml={ 2 } truncation="constant" mr="auto"/>
        { hint }
      </Address>
      <Grid gridTemplateColumns="90px 1fr" columnGap={ 3 } rowGap={ 2 }>
        { before && (
          <>
            <GridItem fontWeight={ 500 }>Before</GridItem>
            <GridItem>{ before }</GridItem>
          </>
        ) }
        { after && (
          <>
            <GridItem fontWeight={ 500 }>After</GridItem>
            <GridItem>{ after }</GridItem>
          </>
        ) }
        <GridItem fontWeight={ 500 }>Change</GridItem>
        <GridItem>{ change }</GridItem>
        { tokenId && (
          <>
            <GridItem fontWeight={ 500 }>Token ID</GridItem>
            <GridItem>{ tokenId }</GridItem>
          </>
        ) }
      </Grid>
    </ListItemMobile>
  );
};

export default TxStateListItem;
