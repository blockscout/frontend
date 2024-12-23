import { Skeleton } from '@chakra-ui/react';
import React from 'react';

import type { ArbitrumL2TxnWithdrawalsItem } from 'types/api/arbitrumL2';

import config from 'configs/app';
import AddressEntityL1 from 'ui/shared/entities/address/AddressEntityL1';
import ListItemMobileGrid from 'ui/shared/ListItemMobile/ListItemMobileGrid';
import ArbitrumL2MessageStatus from 'ui/shared/statusTag/ArbitrumL2MessageStatus';

import ArbitrumL2TxnWithdrawalsClaimButton from './ArbitrumL2TxnWithdrawalsClaimButton';

const rollupFeature = config.features.rollup;

interface Props {
  data: ArbitrumL2TxnWithdrawalsItem;
  isLoading: boolean;
}

const ArbitrumL2TxnWithdrawalsListItem = ({ data, isLoading }: Props) => {
  if (!rollupFeature.isEnabled || rollupFeature.type !== 'arbitrum') {
    return null;
  }

  return (
    <ListItemMobileGrid.Container gridTemplateColumns="110px auto">

      <ListItemMobileGrid.Label isLoading={ isLoading }>Message #</ListItemMobileGrid.Label>
      <ListItemMobileGrid.Value>
        <Skeleton isLoaded={ !isLoading }>{ data.id }</Skeleton>
      </ListItemMobileGrid.Value>

      <ListItemMobileGrid.Label isLoading={ isLoading }>Receiver</ListItemMobileGrid.Label>
      <ListItemMobileGrid.Value>
        <AddressEntityL1 address={{ hash: data.destination }} isLoading={ isLoading }/>
      </ListItemMobileGrid.Value>

      <ListItemMobileGrid.Label isLoading={ isLoading }>Value</ListItemMobileGrid.Label>
      <ListItemMobileGrid.Value>
        333
      </ListItemMobileGrid.Value>

      <ListItemMobileGrid.Label isLoading={ isLoading }>Status</ListItemMobileGrid.Label>
      <ListItemMobileGrid.Value
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        flexWrap="wrap"
        rowGap={ 2 }
        columnGap={ 3 }
        py={ 0 }
      >
        <ArbitrumL2MessageStatus status={ data.status } isLoading={ isLoading }/>
        <ArbitrumL2TxnWithdrawalsClaimButton messageId={ data.id }/>
      </ListItemMobileGrid.Value>

    </ListItemMobileGrid.Container>
  );
};

export default ArbitrumL2TxnWithdrawalsListItem;
