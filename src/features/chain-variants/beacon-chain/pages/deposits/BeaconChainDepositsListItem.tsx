// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

import type { schemas } from '@blockscout/api-types';

import AddressEntity from 'src/slices/address/components/entity/AddressEntity';
import BlockEntity from 'src/slices/block/components/entity/BlockEntity';
import TxEntity from 'src/slices/tx/components/entity/TxEntity';

import config from 'src/config';
import TimeWithTooltip from 'src/shared/date-and-time/TimeWithTooltip';
import ListItemMobileGrid from 'src/shared/lists/ListItemMobileGrid';
import NativeCoinValue from 'src/shared/values/entity/NativeCoinValue';

import BeaconChainDepositSignature from '../../components/BeaconChainDepositSignature';
import BeaconChainDepositStatusTag from '../../components/BeaconChainDepositStatusTag';
import BeaconChainValidatorLink from '../../components/BeaconChainValidatorLink';

const feature = config.features.beaconChain;

interface Props {
  item: schemas['BeaconDeposit'];
  view: 'list' | 'address' | 'block';
  isLoading?: boolean;
};

const BeaconChainDepositsListItem = ({ item, isLoading, view }: Props) => {
  if (!feature.isEnabled || feature.withdrawalsOnly) {
    return null;
  }

  return (
    <ListItemMobileGrid.Container gridTemplateColumns="120px auto">

      { item.transaction_hash && (
        <>
          <ListItemMobileGrid.Label isLoading={ isLoading }>Transaction hash</ListItemMobileGrid.Label>
          <ListItemMobileGrid.Value>
            <TxEntity hash={ item.transaction_hash } isLoading={ isLoading } truncation="constant_long"/>
          </ListItemMobileGrid.Value>
        </>
      ) }

      { view !== 'block' && (
        <>
          { item.block_number && (
            <>
              <ListItemMobileGrid.Label isLoading={ isLoading }>Block</ListItemMobileGrid.Label>
              <ListItemMobileGrid.Value>
                <BlockEntity
                  number={ item.block_number }
                  hash={ item.block_hash }
                  isLoading={ isLoading }
                />
              </ListItemMobileGrid.Value>
            </>
          ) }

          { item.block_timestamp && (
            <>
              <ListItemMobileGrid.Label isLoading={ isLoading }>Age</ListItemMobileGrid.Label>
              <ListItemMobileGrid.Value>
                <TimeWithTooltip
                  timestamp={ item.block_timestamp }
                  isLoading={ isLoading }
                  display="inline-block"
                />
              </ListItemMobileGrid.Value>
            </>
          ) }
        </>
      ) }

      <ListItemMobileGrid.Label isLoading={ isLoading }>Value</ListItemMobileGrid.Label>
      <ListItemMobileGrid.Value>
        <NativeCoinValue
          amount={ item.amount }
          loading={ isLoading }
        />
      </ListItemMobileGrid.Value>

      { view !== 'address' && item.from_address && (
        <>
          <ListItemMobileGrid.Label isLoading={ isLoading }>From</ListItemMobileGrid.Label>
          <ListItemMobileGrid.Value>
            <AddressEntity
              address={ item.from_address }
              isLoading={ isLoading }
              truncation="constant"
            />
          </ListItemMobileGrid.Value>
        </>
      ) }

      { item.pubkey && (
        <>
          <ListItemMobileGrid.Label isLoading={ isLoading }>PubKey</ListItemMobileGrid.Label>
          <ListItemMobileGrid.Value>
            <BeaconChainValidatorLink pubkey={ item.pubkey } isLoading={ isLoading }/>
          </ListItemMobileGrid.Value>
        </>
      ) }

      { item.signature && (
        <>
          <ListItemMobileGrid.Label isLoading={ isLoading }>Signature</ListItemMobileGrid.Label>
          <ListItemMobileGrid.Value>
            <BeaconChainDepositSignature signature={ item.signature } isLoading={ Boolean(isLoading) }/>
          </ListItemMobileGrid.Value>
        </>
      ) }

      <ListItemMobileGrid.Label isLoading={ isLoading }>Status</ListItemMobileGrid.Label>
      <ListItemMobileGrid.Value>
        <BeaconChainDepositStatusTag status={ item.status } isLoading={ Boolean(isLoading) }/>
      </ListItemMobileGrid.Value>

    </ListItemMobileGrid.Container>
  );
};

export default BeaconChainDepositsListItem;
