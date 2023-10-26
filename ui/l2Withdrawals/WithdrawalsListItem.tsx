import { Skeleton } from '@chakra-ui/react';
import React from 'react';

import type { L2WithdrawalsItem } from 'types/api/l2Withdrawals';

import config from 'configs/app';
import dayjs from 'lib/date/dayjs';
import AddressEntity from 'ui/shared/entities/address/AddressEntity';
import TxEntity from 'ui/shared/entities/tx/TxEntity';
import TxEntityL1 from 'ui/shared/entities/tx/TxEntityL1';
import LinkExternal from 'ui/shared/LinkExternal';
import ListItemMobileGrid from 'ui/shared/ListItemMobile/ListItemMobileGrid';

const feature = config.features.optimisticRollup;

type Props = { item: L2WithdrawalsItem; isLoading?: boolean };

const WithdrawalsListItem = ({ item, isLoading }: Props) => {
  const timeAgo = item.l2_timestamp ? dayjs(item.l2_timestamp).fromNow() : null;
  const timeToEnd = item.challenge_period_end ? dayjs(item.challenge_period_end).fromNow(true) + ' left' : null;

  if (!feature.isEnabled) {
    return null;
  }

  return (
    <ListItemMobileGrid.Container>

      <ListItemMobileGrid.Label isLoading={ isLoading }>Msg nonce</ListItemMobileGrid.Label>
      <ListItemMobileGrid.Value>
        <Skeleton isLoaded={ !isLoading } display="inline-block">
          { item.msg_nonce_version + '-' + item.msg_nonce }
        </Skeleton>
      </ListItemMobileGrid.Value>

      { item.from && (
        <>
          <ListItemMobileGrid.Label isLoading={ isLoading }>From</ListItemMobileGrid.Label>
          <ListItemMobileGrid.Value>
            <AddressEntity
              address={ item.from }
              isLoading={ isLoading }
            />
          </ListItemMobileGrid.Value>
        </>
      ) }

      <ListItemMobileGrid.Label isLoading={ isLoading }>L2 txn hash</ListItemMobileGrid.Label>
      <ListItemMobileGrid.Value>
        <TxEntity
          isLoading={ isLoading }
          hash={ item.l2_tx_hash }
          fontSize="sm"
          lineHeight={ 5 }
        />
      </ListItemMobileGrid.Value>

      { timeAgo && (
        <>
          <ListItemMobileGrid.Label isLoading={ isLoading }>Age</ListItemMobileGrid.Label>
          <ListItemMobileGrid.Value>
            <Skeleton isLoaded={ !isLoading } display="inline-block">
              { timeAgo }
            </Skeleton>
          </ListItemMobileGrid.Value>
        </>
      ) }

      <ListItemMobileGrid.Label isLoading={ isLoading }>Status</ListItemMobileGrid.Label>
      <ListItemMobileGrid.Value>
        { item.status === 'Ready for relay' ?
          <LinkExternal href={ feature.withdrawalUrl }>{ item.status }</LinkExternal> :
          <Skeleton isLoaded={ !isLoading } display="inline-block">{ item.status }</Skeleton> }
      </ListItemMobileGrid.Value>

      { item.l1_tx_hash && (
        <>
          <ListItemMobileGrid.Label isLoading={ isLoading }>L1 txn hash</ListItemMobileGrid.Label>
          <ListItemMobileGrid.Value>
            <TxEntityL1
              isLoading={ isLoading }
              hash={ item.l1_tx_hash }
              fontSize="sm"
              lineHeight={ 5 }
            />
          </ListItemMobileGrid.Value>
        </>
      ) }

      { timeToEnd && (
        <>
          <ListItemMobileGrid.Label isLoading={ isLoading }>Time left</ListItemMobileGrid.Label>
          <ListItemMobileGrid.Value>{ timeToEnd }</ListItemMobileGrid.Value>
        </>
      ) }

    </ListItemMobileGrid.Container>
  );
};

export default WithdrawalsListItem;
