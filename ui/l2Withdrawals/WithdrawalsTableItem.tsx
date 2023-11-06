import { Td, Tr, Skeleton } from '@chakra-ui/react';
import React from 'react';

import type { L2WithdrawalsItem } from 'types/api/l2Withdrawals';

import config from 'configs/app';
import dayjs from 'lib/date/dayjs';
import AddressEntity from 'ui/shared/entities/address/AddressEntity';
import TxEntity from 'ui/shared/entities/tx/TxEntity';
import TxEntityL1 from 'ui/shared/entities/tx/TxEntityL1';
import LinkExternal from 'ui/shared/LinkExternal';

const feature = config.features.optimisticRollup;

 type Props = { item: L2WithdrawalsItem; isLoading?: boolean };

const WithdrawalsTableItem = ({ item, isLoading }: Props) => {
  const timeAgo = item.l2_timestamp ? dayjs(item.l2_timestamp).fromNow() : 'N/A';
  const timeToEnd = item.challenge_period_end ? dayjs(item.challenge_period_end).fromNow(true) + ' left' : '';

  if (!feature.isEnabled) {
    return null;
  }

  return (
    <Tr>
      <Td verticalAlign="middle" fontWeight={ 600 }>
        <Skeleton isLoaded={ !isLoading } display="inline-block">{ item.msg_nonce_version + '-' + item.msg_nonce }</Skeleton>
      </Td>
      <Td verticalAlign="middle">
        { item.from ? (
          <AddressEntity
            address={ item.from }
            isLoading={ isLoading }
            truncation="constant"
          />
        ) : 'N/A' }
      </Td>
      <Td verticalAlign="middle">
        <TxEntity
          isLoading={ isLoading }
          hash={ item.l2_tx_hash }
          truncation="constant"
          fontSize="sm"
          lineHeight={ 5 }
        />
      </Td>
      <Td verticalAlign="middle" pr={ 12 }>
        <Skeleton isLoaded={ !isLoading } color="text_secondary" display="inline-block">
          <span> { timeAgo }</span>
        </Skeleton>
      </Td>
      <Td verticalAlign="middle">
        { item.status === 'Ready for relay' ?
          <LinkExternal href={ feature.withdrawalUrl }>{ item.status }</LinkExternal> :
          <Skeleton isLoaded={ !isLoading } display="inline-block">{ item.status }</Skeleton>
        }
      </Td>
      <Td verticalAlign="middle">
        { item.l1_tx_hash ? (
          <TxEntityL1
            isLoading={ isLoading }
            hash={ item.l1_tx_hash }
            truncation="constant"
            fontSize="sm"
            lineHeight={ 5 }
          />
        ) :
          'N/A'
        }
      </Td>
      <Td verticalAlign="middle">
        <Skeleton isLoaded={ !isLoading } color="text_secondary" minW="50px" minH="20px" display="inline-block">{ timeToEnd }</Skeleton>
      </Td>
    </Tr>
  );
};

export default WithdrawalsTableItem;
