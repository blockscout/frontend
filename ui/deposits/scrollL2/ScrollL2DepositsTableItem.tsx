import { Td, Tr, chakra } from '@chakra-ui/react';
import React from 'react';

import type { ScrollL2MessageItem } from 'types/api/scrollL2';

import config from 'configs/app';
import getCurrencyValue from 'lib/getCurrencyValue';
import Skeleton from 'ui/shared/chakra/Skeleton';
import BlockEntityL1 from 'ui/shared/entities/block/BlockEntityL1';
import TxEntity from 'ui/shared/entities/tx/TxEntity';
import TxEntityL1 from 'ui/shared/entities/tx/TxEntityL1';
import TimeAgoWithTooltip from 'ui/shared/TimeAgoWithTooltip';

const rollupFeature = config.features.rollup;

 type Props = { item: ScrollL2MessageItem; isLoading?: boolean };

const ScrollL2DepositsTableItem = ({ item, isLoading }: Props) => {
  if (!rollupFeature.isEnabled || rollupFeature.type !== 'scroll') {
    return null;
  }

  const { valueStr } = getCurrencyValue({ value: item.value, decimals: String(config.chain.currency.decimals) });

  return (
    <Tr>
      <Td verticalAlign="middle">
        <BlockEntityL1
          number={ item.origination_transaction_block_number }
          isLoading={ isLoading }
          fontSize="sm"
          lineHeight={ 5 }
          fontWeight={ 600 }
          noIcon
        />
      </Td>
      <Td verticalAlign="middle">
        <Skeleton isLoaded={ !isLoading }>
          <span>{ item.id }</span>
        </Skeleton>
      </Td>
      <Td verticalAlign="middle">
        <TxEntityL1
          isLoading={ isLoading }
          hash={ item.origination_transaction_hash }
          truncation="constant_long"
          noIcon
          fontSize="sm"
          lineHeight={ 5 }
        />
      </Td>
      <Td verticalAlign="middle" pr={ 12 }>
        <TimeAgoWithTooltip
          timestamp={ item.origination_timestamp }
          isLoading={ isLoading }
          color="text_secondary"
        />
      </Td>
      <Td verticalAlign="middle">
        { item.completion_transaction_hash ? (
          <TxEntity
            isLoading={ isLoading }
            hash={ item.completion_transaction_hash }
            fontSize="sm"
            lineHeight={ 5 }
            truncation="constant_long"
            noIcon
          />
        ) : (
          <chakra.span color="text_secondary">
            Pending Claim
          </chakra.span>
        ) }
      </Td>
      <Td verticalAlign="middle" isNumeric>
        <Skeleton isLoaded={ !isLoading } display="inline-block">
          <span>{ valueStr }</span>
        </Skeleton>
      </Td>
    </Tr>
  );
};

export default ScrollL2DepositsTableItem;
