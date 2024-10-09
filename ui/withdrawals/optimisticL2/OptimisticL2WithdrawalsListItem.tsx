import { Skeleton } from '@chakra-ui/react';
import React from 'react';

import type { OptimisticL2WithdrawalsItem } from 'types/api/optimisticL2';

import config from 'configs/app';
import dayjs from 'lib/date/dayjs';
import AddressEntity from 'ui/shared/entities/address/AddressEntity';
import TxEntity from 'ui/shared/entities/tx/TxEntity';
import TxEntityL1 from 'ui/shared/entities/tx/TxEntityL1';
import LinkExternal from 'ui/shared/links/LinkExternal';
import ListItemMobileGrid from 'ui/shared/ListItemMobile/ListItemMobileGrid';
import TimeAgoWithTooltip from 'ui/shared/TimeAgoWithTooltip';

const rollupFeature = config.features.rollup;

type Props = { item: OptimisticL2WithdrawalsItem; isLoading?: boolean };

const OptimisticL2WithdrawalsListItem = ({ item, isLoading }: Props) => {
  const timeToEnd = item.challenge_period_end ? dayjs(item.challenge_period_end).fromNow(true) + ' left' : null;

  if (!rollupFeature.isEnabled || rollupFeature.type !== 'optimistic') {
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
              truncation="constant"
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
          truncation="constant_long"
        />
      </ListItemMobileGrid.Value>

      { item.l2_timestamp && (
        <>
          <ListItemMobileGrid.Label isLoading={ isLoading }>Age</ListItemMobileGrid.Label>
          <ListItemMobileGrid.Value>
            <TimeAgoWithTooltip
              timestamp={ item.l2_timestamp }
              isLoading={ isLoading }
              display="inline-block"
            />
          </ListItemMobileGrid.Value>
        </>
      ) }

      <ListItemMobileGrid.Label isLoading={ isLoading }>Status</ListItemMobileGrid.Label>
      <ListItemMobileGrid.Value>
        { item.status === 'Ready for relay' && rollupFeature.L2WithdrawalUrl ?
          <LinkExternal href={ rollupFeature.L2WithdrawalUrl }>{ item.status }</LinkExternal> :
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
              truncation="constant_long"
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

export default OptimisticL2WithdrawalsListItem;
