import { Td, Tr } from '@chakra-ui/react';
import React from 'react';

import type { ShibariumWithdrawalsItem } from 'types/api/shibarium';

import config from 'configs/app';
import AddressStringOrParam from 'ui/shared/entities/address/AddressStringOrParam';
import BlockEntity from 'ui/shared/entities/block/BlockEntity';
import TxEntity from 'ui/shared/entities/tx/TxEntity';
import TxEntityL1 from 'ui/shared/entities/tx/TxEntityL1';
import TimeAgoWithTooltip from 'ui/shared/TimeAgoWithTooltip';

const feature = config.features.rollup;

 type Props = { item: ShibariumWithdrawalsItem; isLoading?: boolean };

const WithdrawalsTableItem = ({ item, isLoading }: Props) => {
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
        <TimeAgoWithTooltip
          timestamp={ item.timestamp }
          isLoading={ isLoading }
          display="inline-block"
          color="text_secondary"
        />
      </Td>
    </Tr>
  );
};

export default WithdrawalsTableItem;
