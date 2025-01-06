import { Skeleton, chakra } from '@chakra-ui/react';
import React from 'react';

import type { ArbitrumL2MessagesItem } from 'types/api/arbitrumL2';

import config from 'configs/app';
import AddressEntity from 'ui/shared/entities/address/AddressEntity';
import BlockEntityL1 from 'ui/shared/entities/block/BlockEntityL1';
import TxEntity from 'ui/shared/entities/tx/TxEntity';
import TxEntityL1 from 'ui/shared/entities/tx/TxEntityL1';
import ListItemMobileGrid from 'ui/shared/ListItemMobile/ListItemMobileGrid';
import ArbitrumL2MessageStatus from 'ui/shared/statusTag/ArbitrumL2MessageStatus';
import TimeAgoWithTooltip from 'ui/shared/TimeAgoWithTooltip';

import type { MessagesDirection } from './ArbitrumL2Messages';

const rollupFeature = config.features.rollup;

type Props = { item: ArbitrumL2MessagesItem; isLoading?: boolean; direction: MessagesDirection };

const ArbitrumL2MessagesListItem = ({ item, isLoading, direction }: Props) => {
  if (!rollupFeature.isEnabled || rollupFeature.type !== 'arbitrum') {
    return null;
  }

  const l1TxHash = direction === 'from-rollup' ? item.completion_transaction_hash : item.origination_transaction_hash;
  const l2TxHash = direction === 'from-rollup' ? item.origination_transaction_hash : item.completion_transaction_hash;

  return (
    <ListItemMobileGrid.Container gridTemplateColumns="110px auto">

      { direction === 'to-rollup' && (
        <>
          <ListItemMobileGrid.Label isLoading={ isLoading }>L1 block</ListItemMobileGrid.Label>
          <ListItemMobileGrid.Value>
            { item.origination_transaction_block_number ? (
              <BlockEntityL1
                number={ item.origination_transaction_block_number }
                isLoading={ isLoading }
                fontSize="sm"
                lineHeight={ 5 }
                fontWeight={ 600 }
              />
            ) : <chakra.span>N/A</chakra.span> }
          </ListItemMobileGrid.Value>
        </>
      ) }

      { direction === 'from-rollup' && (
        <>
          <ListItemMobileGrid.Label isLoading={ isLoading }>From</ListItemMobileGrid.Label>
          <ListItemMobileGrid.Value>
            <AddressEntity
              address={{ hash: item.origination_address }}
              truncation="constant"
              isLoading={ isLoading }
              fontSize="sm"
              lineHeight={ 5 }
              fontWeight={ 600 }
            />
          </ListItemMobileGrid.Value>
        </>
      ) }

      <ListItemMobileGrid.Label isLoading={ isLoading }>Message #</ListItemMobileGrid.Label>
      <ListItemMobileGrid.Value>
        <Skeleton isLoaded={ !isLoading } display="inline-block">
          { item.id }
        </Skeleton>
      </ListItemMobileGrid.Value>

      <ListItemMobileGrid.Label isLoading={ isLoading }>L2 transaction</ListItemMobileGrid.Label>
      <ListItemMobileGrid.Value>
        { l2TxHash ? (
          <TxEntity
            isLoading={ isLoading }
            hash={ l2TxHash }
            fontSize="sm"
            lineHeight={ 5 }
            truncation="constant_long"
          />
        ) : (
          <chakra.span>
            N/A
          </chakra.span>
        ) }
      </ListItemMobileGrid.Value>

      { item.origination_timestamp && (
        <>
          <ListItemMobileGrid.Label isLoading={ isLoading }>Age</ListItemMobileGrid.Label>
          <ListItemMobileGrid.Value>
            <TimeAgoWithTooltip
              timestamp={ item.origination_timestamp }
              isLoading={ isLoading }
              display="inline-block"
            />
          </ListItemMobileGrid.Value>
        </>
      ) }

      <ListItemMobileGrid.Label isLoading={ isLoading }>Status</ListItemMobileGrid.Label>
      <ListItemMobileGrid.Value>
        <ArbitrumL2MessageStatus status={ item.status } isLoading={ isLoading }/>
      </ListItemMobileGrid.Value>

      <ListItemMobileGrid.Label isLoading={ isLoading }>L1 transaction</ListItemMobileGrid.Label>
      <ListItemMobileGrid.Value>
        { l1TxHash ? (
          <TxEntityL1
            isLoading={ isLoading }
            hash={ l1TxHash }
            fontSize="sm"
            lineHeight={ 5 }
            truncation="constant_long"
          />
        ) : (
          <chakra.span>
            N/A
          </chakra.span>
        ) }
      </ListItemMobileGrid.Value>

    </ListItemMobileGrid.Container>
  );
};

export default ArbitrumL2MessagesListItem;
