// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

import type { ArbitrumL2TxnBatchesItem } from '../../types/api';

import { route } from 'nextjs-routes';

import BatchEntityL2 from 'client/features/rollup/common/components/BatchEntityL2';
import BlockEntityL1 from 'client/features/rollup/common/components/BlockEntityL1';
import TxEntityL1 from 'client/features/rollup/common/components/TxEntityL1';
import { layerLabels } from 'client/features/rollup/common/utils/layer';

import config from 'configs/app';
import { Link } from 'toolkit/chakra/link';
import { Skeleton } from 'toolkit/chakra/skeleton';
import ListItemMobileGrid from 'ui/shared/ListItemMobile/ListItemMobileGrid';
import TimeWithTooltip from 'ui/shared/time/TimeWithTooltip';

import ArbitrumL2TxnBatchDA from '../../components/ArbitrumL2TxnBatchDA';
import ArbitrumL2TxnBatchStatus from '../../components/ArbitrumL2TxnBatchStatus';

const rollupFeature = config.features.rollup;

type Props = { item: ArbitrumL2TxnBatchesItem; isLoading?: boolean };

const ArbitrumL2TxnBatchesListItem = ({ item, isLoading }: Props) => {
  if (!rollupFeature.isEnabled || rollupFeature.type !== 'arbitrum') {
    return null;
  }

  return (
    <ListItemMobileGrid.Container gridTemplateColumns="110px auto">

      <ListItemMobileGrid.Label isLoading={ isLoading }>Batch #</ListItemMobileGrid.Label>
      <ListItemMobileGrid.Value>
        <BatchEntityL2
          isLoading={ isLoading }
          number={ item.number }
          fontWeight={ 600 }
        />
      </ListItemMobileGrid.Value>

      <ListItemMobileGrid.Label isLoading={ isLoading }>{ layerLabels.parent } status</ListItemMobileGrid.Label>
      <ListItemMobileGrid.Value>
        <ArbitrumL2TxnBatchStatus status={ item.commitment_transaction.status } isLoading={ isLoading }/>
      </ListItemMobileGrid.Value>

      <ListItemMobileGrid.Label isLoading={ isLoading }>{ layerLabels.parent } block</ListItemMobileGrid.Label>
      <ListItemMobileGrid.Value>
        <BlockEntityL1
          number={ item.commitment_transaction.block_number }
          isLoading={ isLoading }
        />
      </ListItemMobileGrid.Value>

      { item.blocks_count && (
        <>
          <ListItemMobileGrid.Label isLoading={ isLoading }>Block count</ListItemMobileGrid.Label>
          <ListItemMobileGrid.Value>
            <Skeleton loading={ isLoading } display="inline-block">{ item.blocks_count.toLocaleString() }</Skeleton>
          </ListItemMobileGrid.Value>
        </>
      ) }

      <ListItemMobileGrid.Label isLoading={ isLoading }>{ layerLabels.parent } transaction</ListItemMobileGrid.Label>
      <ListItemMobileGrid.Value>
        <TxEntityL1
          hash={ item.commitment_transaction.hash }
          isLoading={ isLoading }
          truncation="constant_long"
          noCopy
        />
      </ListItemMobileGrid.Value>

      <ListItemMobileGrid.Label isLoading={ isLoading }>Age</ListItemMobileGrid.Label>
      <ListItemMobileGrid.Value>
        <TimeWithTooltip
          timestamp={ item.commitment_transaction.timestamp }
          fallbackText="Undefined"
          isLoading={ isLoading }
          display="inline-block"
        />
      </ListItemMobileGrid.Value>

      <ListItemMobileGrid.Label isLoading={ isLoading }>Txn count</ListItemMobileGrid.Label>
      <ListItemMobileGrid.Value>
        <Link
          href={ route({ pathname: '/batches/[number]', query: { number: item.number.toString(), tab: 'txs' } }) }
          loading={ isLoading }
          fontWeight={ 600 }
          minW="40px"
        >
          { item.transactions_count.toLocaleString() }
        </Link>
      </ListItemMobileGrid.Value>

      <ListItemMobileGrid.Label isLoading={ isLoading }>Data container</ListItemMobileGrid.Label>
      <ListItemMobileGrid.Value>
        <ArbitrumL2TxnBatchDA dataContainer={ item.batch_data_container } isLoading={ isLoading }/>
      </ListItemMobileGrid.Value>

    </ListItemMobileGrid.Container>
  );
};

export default ArbitrumL2TxnBatchesListItem;
