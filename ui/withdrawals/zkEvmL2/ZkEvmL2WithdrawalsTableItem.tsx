import { Td, Tr, Skeleton, chakra } from '@chakra-ui/react';
import BigNumber from 'bignumber.js';
import React from 'react';

import type { ZkEvmL2WithdrawalsItem } from 'types/api/zkEvmL2';

import config from 'configs/app';
import BlockEntity from 'ui/shared/entities/block/BlockEntity';
import TxEntity from 'ui/shared/entities/tx/TxEntity';
import TxEntityL1 from 'ui/shared/entities/tx/TxEntityL1';
import TimeAgoWithTooltip from 'ui/shared/TimeAgoWithTooltip';

const rollupFeature = config.features.rollup;

 type Props = { item: ZkEvmL2WithdrawalsItem; isLoading?: boolean };

const ZkEvmL2WithdrawalsTableItem = ({ item, isLoading }: Props) => {
  if (!rollupFeature.isEnabled || rollupFeature.type !== 'zkEvm') {
    return null;
  }

  return (
    <Tr>
      <Td verticalAlign="middle">
        <BlockEntity
          number={ item.block_number }
          isLoading={ isLoading }
          fontSize="sm"
          lineHeight={ 5 }
          fontWeight={ 600 }
          noIcon
        />
      </Td>
      <Td verticalAlign="middle">
        <Skeleton isLoaded={ !isLoading }>
          <span>{ item.index }</span>
        </Skeleton>
      </Td>
      <Td verticalAlign="middle">
        <TxEntity
          isLoading={ isLoading }
          hash={ item.l2_transaction_hash }
          fontSize="sm"
          lineHeight={ 5 }
          truncation="constant_long"
          noIcon
        />
      </Td>
      <Td verticalAlign="middle" pr={ 12 }>
        <TimeAgoWithTooltip
          timestamp={ item.timestamp }
          isLoading={ isLoading }
          color="text_secondary"
        />
      </Td>
      <Td verticalAlign="middle">
        { item.l1_transaction_hash ? (
          <TxEntityL1
            isLoading={ isLoading }
            hash={ item.l1_transaction_hash }
            truncation="constant_long"
            noIcon
            fontSize="sm"
            lineHeight={ 5 }
          />
        ) : (
          <chakra.span color="text_secondary">
            Pending Claim
          </chakra.span>
        ) }
      </Td>
      <Td verticalAlign="middle" isNumeric>
        <Skeleton isLoaded={ !isLoading } display="inline-block">
          <span>{ BigNumber(item.value).toFormat() }</span>
        </Skeleton>
      </Td>
      <Td verticalAlign="middle">
        <Skeleton isLoaded={ !isLoading } display="inline-block">
          <span>{ item.symbol }</span>
        </Skeleton>
      </Td>
    </Tr>
  );
};

export default ZkEvmL2WithdrawalsTableItem;
