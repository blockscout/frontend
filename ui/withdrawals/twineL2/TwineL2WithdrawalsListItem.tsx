import React from 'react';

import type { TwineL2WithdrawalsItem } from 'types/api/twineL2';

import config from 'configs/app';
import AddressEntity from 'ui/shared/entities/address/AddressEntity';
import AddressEntityL1 from 'ui/shared/entities/address/AddressEntityL1';
import BlockEntityL1 from 'ui/shared/entities/block/BlockEntityL1';
import TxEntity from 'ui/shared/entities/tx/TxEntity';
import ListItemMobileGrid from 'ui/shared/ListItemMobile/ListItemMobileGrid';
import TimeAgoWithTooltip from 'ui/shared/TimeAgoWithTooltip';

const rollupFeature = config.features.rollup;

type Props = { item: TwineL2WithdrawalsItem; isLoading?: boolean };

const TwineWithdrawalsListItem = ({ item, isLoading }: Props) => {
  if (!rollupFeature.isEnabled || rollupFeature.type !== 'twine') {
    return null;
  }

  return (
    <ListItemMobileGrid.Container>

      <ListItemMobileGrid.Label isLoading={ isLoading }>Block number</ListItemMobileGrid.Label>
      <ListItemMobileGrid.Value>
        <BlockEntityL1
          number={ item.block_number }
          isLoading={ isLoading }
          fontSize="sm"
          lineHeight={ 5 }
          fontWeight={ 600 }
        />
      </ListItemMobileGrid.Value>

      <ListItemMobileGrid.Label isLoading={ isLoading }>Tx Hash</ListItemMobileGrid.Label>
      <ListItemMobileGrid.Value>
        <TxEntity
          isLoading={ isLoading }
          hash={ item.tx_hash }
          fontSize="sm"
          lineHeight={ 5 }
          truncation="constant_long"
        />
      </ListItemMobileGrid.Value>

      <ListItemMobileGrid.Label isLoading={ isLoading }>Age</ListItemMobileGrid.Label>
      <ListItemMobileGrid.Value>
        <TimeAgoWithTooltip
          timestamp={ item.created_at }
          isLoading={ isLoading }
          display="inline-block"
        />
      </ListItemMobileGrid.Value>

      <ListItemMobileGrid.Label isLoading={ isLoading }>L1 Token Address</ListItemMobileGrid.Label>
      <ListItemMobileGrid.Value>
        <AddressEntityL1
          address={{ hash: item.l1_token, name: '', is_contract: false, is_verified: false, ens_domain_name: null, implementations: null }}
          isLoading={ isLoading }
          noCopy
          truncation="constant"
        />
      </ListItemMobileGrid.Value>
      <ListItemMobileGrid.Label isLoading={ isLoading }>L2 Token Address</ListItemMobileGrid.Label>
      <ListItemMobileGrid.Value>
        <AddressEntityL1
          address={{ hash: item.l2_token, name: '', is_contract: false, is_verified: false, ens_domain_name: null, implementations: null }}
          isLoading={ isLoading }
          noCopy
          truncation="constant"
        />
      </ListItemMobileGrid.Value>
      <ListItemMobileGrid.Label isLoading={ isLoading }>From</ListItemMobileGrid.Label>
      <ListItemMobileGrid.Value>
        <AddressEntityL1
          address={{ hash: item.from, name: '', is_contract: false, is_verified: false, ens_domain_name: null, implementations: null }}
          isLoading={ isLoading }
          noCopy
          truncation="constant"
        />
      </ListItemMobileGrid.Value>
      <ListItemMobileGrid.Label isLoading={ isLoading }>To (Twine Address)</ListItemMobileGrid.Label>
      <ListItemMobileGrid.Value>
        <AddressEntity
          address={{ hash: item.to_twine_address, name: '', is_contract: false, is_verified: false, ens_domain_name: null, implementations: null }}
          isLoading={ isLoading }
          noCopy
          truncation="constant"
        />
      </ListItemMobileGrid.Value>

      <ListItemMobileGrid.Label isLoading={ isLoading }>Amount</ListItemMobileGrid.Label>
      <ListItemMobileGrid.Value>
        { item.amount }
      </ListItemMobileGrid.Value>

    </ListItemMobileGrid.Container>
  );
};

export default TwineWithdrawalsListItem;
