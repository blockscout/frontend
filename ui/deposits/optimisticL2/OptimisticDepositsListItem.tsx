import { Skeleton } from '@chakra-ui/react';
import BigNumber from 'bignumber.js';
import React from 'react';

import type { OptimisticL2DepositsItem } from 'types/api/optimisticL2';

import config from 'configs/app';
import dayjs from 'lib/date/dayjs';
import AddressEntityL1 from 'ui/shared/entities/address/AddressEntityL1';
import BlockEntityL1 from 'ui/shared/entities/block/BlockEntityL1';
import TxEntity from 'ui/shared/entities/tx/TxEntity';
import TxEntityL1 from 'ui/shared/entities/tx/TxEntityL1';
import ListItemMobileGrid from 'ui/shared/ListItemMobile/ListItemMobileGrid';

const rollupFeature = config.features.rollup;

type Props = { item: OptimisticL2DepositsItem; isLoading?: boolean };

const OptimisticDepositsListItem = ({ item, isLoading }: Props) => {
  const timeAgo = dayjs(item.l1_block_timestamp).fromNow();

  if (!rollupFeature.isEnabled || rollupFeature.type !== 'optimistic') {
    return null;
  }

  return (
    <ListItemMobileGrid.Container>

      <ListItemMobileGrid.Label isLoading={ isLoading }>L1 block No</ListItemMobileGrid.Label>
      <ListItemMobileGrid.Value>
        <BlockEntityL1
          number={ item.l1_block_number }
          isLoading={ isLoading }
          fontSize="sm"
          lineHeight={ 5 }
          fontWeight={ 600 }
        />
      </ListItemMobileGrid.Value>

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

      <ListItemMobileGrid.Label isLoading={ isLoading }>Age</ListItemMobileGrid.Label>
      <ListItemMobileGrid.Value>
        <Skeleton isLoaded={ !isLoading } display="inline-block">{ timeAgo }</Skeleton>
      </ListItemMobileGrid.Value>

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

      <ListItemMobileGrid.Label isLoading={ isLoading }>L1 txn origin</ListItemMobileGrid.Label>
      <ListItemMobileGrid.Value>
        <AddressEntityL1
          address={{ hash: item.l1_tx_origin, name: '', is_contract: false, is_verified: false, implementation_name: '', ens_domain_name: null }}
          isLoading={ isLoading }
          noCopy
          truncation="constant"
        />
      </ListItemMobileGrid.Value>

      <ListItemMobileGrid.Label isLoading={ isLoading }>Gas limit</ListItemMobileGrid.Label>
      <ListItemMobileGrid.Value>
        <Skeleton isLoaded={ !isLoading } display="inline-block">{ BigNumber(item.l2_tx_gas_limit).toFormat() }</Skeleton>
      </ListItemMobileGrid.Value>

    </ListItemMobileGrid.Container>
  );
};

export default OptimisticDepositsListItem;
