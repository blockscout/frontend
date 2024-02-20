import { Td, Tr, Skeleton } from '@chakra-ui/react';
import React from 'react';

import type { ShibariumWithdrawalsItem } from 'types/api/shibarium';

import config from 'configs/app';
import dayjs from 'lib/date/dayjs';
import AddressStringOrParam from 'ui/shared/entities/address/AddressStringOrParam';
import BlockEntity from 'ui/shared/entities/block/BlockEntity';
import TxEntity from 'ui/shared/entities/tx/TxEntity';
import TxEntityL1 from 'ui/shared/entities/tx/TxEntityL1';

const feature = config.features.rollup;

 type Props = { item: ShibariumWithdrawalsItem; isLoading?: boolean };

const WithdrawalsTableItem = ({ item, isLoading }: Props) => {
  const timeAgo = dayjs(item.timestamp).fromNow();

  if (!(feature.isEnabled && feature.type === 'shibarium')) {
    return null;
  }

  return (
    <Tr>
      <Td verticalAlign="middle">
        <BlockEntity
          number={ item.l2_block_number }
          isLoading={ isLoading }
          fontSize="sm"
          lineHeight={ 5 }
          fontWeight={ 600 }
        />
      </Td>
      <Td verticalAlign="middle">
        <TxEntity
          isLoading={ isLoading }
          hash={ item.l2_transaction_hash }
          fontSize="sm"
          lineHeight={ 5 }
          truncation="constant_long"
        />
      </Td>
      <Td verticalAlign="middle">
        <TxEntityL1
          isLoading={ isLoading }
          hash={ item.l1_transaction_hash }
          truncation="constant_long"
          fontSize="sm"
          lineHeight={ 5 }
        />
      </Td>
      <Td verticalAlign="middle">
        <AddressStringOrParam
          address={ item.user }
          isLoading={ isLoading }
          truncation="constant"
          noCopy
        />
      </Td>
      <Td verticalAlign="middle" pr={ 12 }>
        <Skeleton isLoaded={ !isLoading } color="text_secondary" display="inline-block"><span>{ timeAgo }</span></Skeleton>
      </Td>
    </Tr>
  );
};

export default WithdrawalsTableItem;
