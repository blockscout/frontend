import { Td, Tr } from '@chakra-ui/react';
import React from 'react';

import type { TwineL2WithdrawalsItem } from 'types/api/twineL2';

import config from 'configs/app';
import AddressEntity from 'ui/shared/entities/address/AddressEntity';
import AddressEntityL1 from 'ui/shared/entities/address/AddressEntityL1';
import BlockEntityL1 from 'ui/shared/entities/block/BlockEntityL1';
import TxEntity from 'ui/shared/entities/tx/TxEntity';
import TimeAgoWithTooltip from 'ui/shared/TimeAgoWithTooltip';

const rollupFeature = config.features.rollup;

 type Props = { item: TwineL2WithdrawalsItem; isLoading?: boolean };

const TwineWithdrawalsTableItem = ({ item, isLoading }: Props) => {

  if (!rollupFeature.isEnabled || rollupFeature.type !== 'twine') {
    return null;
  }

  return (
    <Tr>
      <Td verticalAlign="middle">
        <BlockEntityL1
          number={ item.block_number }
          isLoading={ isLoading }
          fontSize="sm"
          lineHeight={ 5 }
          fontWeight={ 600 }
          noIcon
        />
      </Td>
      <Td verticalAlign="middle">
        <TxEntity
          isLoading={ isLoading }
          hash={ item.tx_hash }
          fontSize="sm"
          lineHeight={ 5 }
          truncation="constant_long"
          noIcon
        />
      </Td>
      <Td verticalAlign="middle" pr={ 12 }>
        <TimeAgoWithTooltip
          timestamp={ item.created_at }
          isLoading={ isLoading }
          color="text_secondary"
          display="inline-block"
        />
      </Td>

      <Td verticalAlign="middle">
        <AddressEntityL1
          address={{ hash: item.l1_token, name: '', is_contract: false, is_verified: false, ens_domain_name: null, implementations: null }}
          isLoading={ isLoading }
          truncation="constant"
          noCopy
        />
      </Td>
      <Td verticalAlign="middle">
        <AddressEntity
          address={{ hash: item.l2_token, name: '', is_contract: false, is_verified: false, ens_domain_name: null, implementations: null }}
          isLoading={ isLoading }
          truncation="constant"
          noCopy
        />
      </Td>
      <Td verticalAlign="middle">
        <AddressEntityL1
          address={{ hash: item.from, name: '', is_contract: false, is_verified: false, ens_domain_name: null, implementations: null }}
          isLoading={ isLoading }
          truncation="constant"
          noCopy
        />
      </Td>
      <Td verticalAlign="middle">
        <AddressEntity
          address={{ hash: item.to_twine_address, name: '', is_contract: false, is_verified: false, ens_domain_name: null, implementations: null }}
          isLoading={ isLoading }
          truncation="constant"
          noCopy
        />
      </Td>

    </Tr>
  );
};

export default TwineWithdrawalsTableItem;
