import { Td, Tr, Skeleton } from '@chakra-ui/react';
import React from 'react';

import type { ArbitrumL2TxnBatchesItem } from 'types/api/arbitrumL2';

import { route } from 'nextjs-routes';

import config from 'configs/app';
import dayjs from 'lib/date/dayjs';
import BatchEntityL2 from 'ui/shared/entities/block/BatchEntityL2';
import BlockEntityL1 from 'ui/shared/entities/block/BlockEntityL1';
import TxEntityL1 from 'ui/shared/entities/tx/TxEntityL1';
import LinkInternal from 'ui/shared/links/LinkInternal';
import ArbitrumL2TxnBatchStatus from 'ui/shared/statusTag/ArbitrumL2TxnBatchStatus';

const rollupFeature = config.features.rollup;

type Props = { item: ArbitrumL2TxnBatchesItem; isLoading?: boolean };

const TxnBatchesTableItem = ({ item, isLoading }: Props) => {
  const timeAgo = item.commitment_transaction.timestamp ? dayjs(item.commitment_transaction.timestamp).fromNow() : 'Undefined';

  if (!rollupFeature.isEnabled || rollupFeature.type !== 'arbitrum') {
    return null;
  }

  return (
    <Tr>
      <Td verticalAlign="middle">
        <BatchEntityL2
          isLoading={ isLoading }
          number={ item.number }
          fontSize="sm"
          lineHeight={ 5 }
          fontWeight={ 600 }
          noIcon
        />
      </Td>
      <Td verticalAlign="middle">
        <ArbitrumL2TxnBatchStatus status={ item.commitment_transaction.status } isLoading={ isLoading }/>
      </Td>
      <Td verticalAlign="middle">
        <BlockEntityL1
          number={ item.commitment_transaction.block_number }
          isLoading={ isLoading }
          fontSize="sm"
          lineHeight={ 5 }
        />
      </Td>
      <Td verticalAlign="middle">
        <Skeleton isLoaded={ !isLoading } display="inline-block">{ item.blocks_count ? item.blocks_count.toLocaleString() : 'N/A' }</Skeleton>
      </Td>
      <Td pr={ 12 } verticalAlign="middle">
        <TxEntityL1
          hash={ item.commitment_transaction.hash }
          isLoading={ isLoading }
          fontSize="sm"
          lineHeight={ 5 }
          truncation="constant_long"
        />
      </Td>
      <Td verticalAlign="middle">
        <Skeleton isLoaded={ !isLoading } color="text_secondary">
          <span>{ timeAgo }</span>
        </Skeleton>
      </Td>
      <Td verticalAlign="middle">
        <LinkInternal
          href={ route({ pathname: '/batches/[number]', query: { number: item.number.toString(), tab: 'txs' } }) }
          isLoading={ isLoading }
        >
          <Skeleton isLoaded={ !isLoading } minW="40px">
            { item.transactions_count.toLocaleString() }
          </Skeleton>
        </LinkInternal>
      </Td>
    </Tr>
  );
};

export default TxnBatchesTableItem;
