import { Skeleton, chakra } from '@chakra-ui/react';
import BigNumber from 'bignumber.js';
import React from 'react';

import type { ZkEvmL2DepositsItem } from 'types/api/zkEvmL2';

import config from 'configs/app';
import BlockEntityL1 from 'ui/shared/entities/block/BlockEntityL1';
import TxEntity from 'ui/shared/entities/tx/TxEntity';
import TxEntityL1 from 'ui/shared/entities/tx/TxEntityL1';
import ListItemMobileGrid from 'ui/shared/ListItemMobile/ListItemMobileGrid';
import TimeAgoWithTooltip from 'ui/shared/TimeAgoWithTooltip';

const rollupFeature = config.features.rollup;

type Props = { item: ZkEvmL2DepositsItem; isLoading?: boolean };

const ZkEvmL2DepositsListItem = ({ item, isLoading }: Props) => {
  if (!rollupFeature.isEnabled || rollupFeature.type !== 'zkEvm') {
    return null;
  }

  return (
    <ListItemMobileGrid.Container>

      <ListItemMobileGrid.Label isLoading={ isLoading }>L1 block</ListItemMobileGrid.Label>
      <ListItemMobileGrid.Value>
        <BlockEntityL1
          number={ item.block_number }
          isLoading={ isLoading }
          fontSize="sm"
          lineHeight={ 5 }
          fontWeight={ 600 }
        />
      </ListItemMobileGrid.Value>

      <ListItemMobileGrid.Label isLoading={ isLoading }>Index</ListItemMobileGrid.Label>
      <ListItemMobileGrid.Value>
        <Skeleton isLoaded={ !isLoading } display="inline-block">
          { item.index }
        </Skeleton>
      </ListItemMobileGrid.Value>

      <ListItemMobileGrid.Label isLoading={ isLoading }>L1 txn hash</ListItemMobileGrid.Label>
      <ListItemMobileGrid.Value>
        <TxEntityL1
          isLoading={ isLoading }
          hash={ item.l1_transaction_hash }
          fontSize="sm"
          lineHeight={ 5 }
          truncation="constant_long"
        />
      </ListItemMobileGrid.Value>

      <ListItemMobileGrid.Label isLoading={ isLoading }>Age</ListItemMobileGrid.Label>
      <ListItemMobileGrid.Value>
        <TimeAgoWithTooltip
          timestamp={ item.timestamp }
          isLoading={ isLoading }
          display="inline-block"
        />
      </ListItemMobileGrid.Value>

      <ListItemMobileGrid.Label isLoading={ isLoading }>L2 txn hash</ListItemMobileGrid.Label>
      <ListItemMobileGrid.Value>
        { item.l2_transaction_hash ? (
          <TxEntity
            isLoading={ isLoading }
            hash={ item.l2_transaction_hash }
            fontSize="sm"
            lineHeight={ 5 }
            truncation="constant_long"
          />
        ) : (
          <chakra.span>
            Pending Claim
          </chakra.span>
        ) }
      </ListItemMobileGrid.Value>

      <ListItemMobileGrid.Label isLoading={ isLoading }>Value</ListItemMobileGrid.Label>
      <ListItemMobileGrid.Value>
        <Skeleton isLoaded={ !isLoading } display="inline-block">
          { BigNumber(item.value).toFormat() }
        </Skeleton>
      </ListItemMobileGrid.Value>

      <ListItemMobileGrid.Label isLoading={ isLoading }>Token</ListItemMobileGrid.Label>
      <ListItemMobileGrid.Value>
        <Skeleton isLoaded={ !isLoading } display="inline-block">
          { item.symbol }
        </Skeleton>
      </ListItemMobileGrid.Value>

    </ListItemMobileGrid.Container>
  );
};

export default ZkEvmL2DepositsListItem;
