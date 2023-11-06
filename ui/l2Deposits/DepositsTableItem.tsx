import { Td, Tr, Skeleton } from '@chakra-ui/react';
import BigNumber from 'bignumber.js';
import React from 'react';

import type { L2DepositsItem } from 'types/api/l2Deposits';

import config from 'configs/app';
import dayjs from 'lib/date/dayjs';
import AddressEntityL1 from 'ui/shared/entities/address/AddressEntityL1';
import BlockEntityL1 from 'ui/shared/entities/block/BlockEntityL1';
import TxEntity from 'ui/shared/entities/tx/TxEntity';
import TxEntityL1 from 'ui/shared/entities/tx/TxEntityL1';

const feature = config.features.optimisticRollup;

 type Props = { item: L2DepositsItem; isLoading?: boolean };

const WithdrawalsTableItem = ({ item, isLoading }: Props) => {
  const timeAgo = dayjs(item.l1_block_timestamp).fromNow();

  if (!feature.isEnabled) {
    return null;
  }

  return (
    <Tr>
      <Td verticalAlign="middle">
        <BlockEntityL1
          number={ item.l1_block_number }
          isLoading={ isLoading }
          fontSize="sm"
          lineHeight={ 5 }
          fontWeight={ 600 }
        />
      </Td>
      <Td verticalAlign="middle">
        <TxEntity
          isLoading={ isLoading }
          hash={ item.l2_tx_hash }
          fontSize="sm"
          lineHeight={ 5 }
          truncation="constant"
        />
      </Td>
      <Td verticalAlign="middle" pr={ 12 }>
        <Skeleton isLoaded={ !isLoading } color="text_secondary" display="inline-block"><span>{ timeAgo }</span></Skeleton>
      </Td>
      <Td verticalAlign="middle">
        <TxEntityL1
          isLoading={ isLoading }
          hash={ item.l1_tx_hash }
          truncation="constant"
          fontSize="sm"
          lineHeight={ 5 }
        />
      </Td>
      <Td verticalAlign="middle">
        <AddressEntityL1
          address={{ hash: item.l1_tx_origin, name: '', is_contract: false, is_verified: false, implementation_name: '' }}
          isLoading={ isLoading }
          truncation="constant"
          noCopy
        />
      </Td>
      <Td verticalAlign="middle" isNumeric>
        <Skeleton isLoaded={ !isLoading } color="text_secondary" display="inline-block">
          <span>{ BigNumber(item.l2_tx_gas_limit).toFormat() }</span>
        </Skeleton>
      </Td>
    </Tr>
  );
};

export default WithdrawalsTableItem;
