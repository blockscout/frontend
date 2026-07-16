// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

import type { schemas } from '@blockscout/api-types';
import type { ClusterChainConfig } from 'src/features/multichain/types/client';

import AddressStringOrParam from 'src/slices/address/components/entity/AddressStringOrParam';
import BlockEntity from 'src/slices/block/components/entity/BlockEntity';
import TxEntity from 'src/slices/tx/components/entity/TxEntity';

import { useMultichainContext } from 'src/features/multichain/context';
import UserOpEntity from 'src/features/user-ops/components/entity/UserOpEntity';
import UserOpStatus from 'src/features/user-ops/components/UserOpStatus';

import config from 'src/config';
import TimeWithTooltip from 'src/shared/date-and-time/TimeWithTooltip';
import ListItemMobileGrid from 'src/shared/lists/ListItemMobileGrid';
import NativeCoinValue from 'src/shared/values/entity/NativeCoinValue';

type Props = {
  item: schemas['UserOperationInList'];
  isLoading?: boolean;
  showTx: boolean;
  showSender: boolean;
  chainData?: ClusterChainConfig;
};

const UserOpsListItem = ({ item, isLoading, showTx, showSender, chainData }: Props) => {
  const multichainContext = useMultichainContext();
  const chainConfig = (multichainContext?.chain.app_config || config);

  return (
    <ListItemMobileGrid.Container gridTemplateColumns="100px auto">

      <ListItemMobileGrid.Label isLoading={ isLoading }>User op hash</ListItemMobileGrid.Label>
      <ListItemMobileGrid.Value>
        <UserOpEntity hash={ item.hash } isLoading={ isLoading } fontWeight="700" noIcon={ !chainData } truncation="constant_long" chain={ chainData } noCopy/>
      </ListItemMobileGrid.Value>

      <ListItemMobileGrid.Label isLoading={ isLoading }>Age</ListItemMobileGrid.Label>
      <ListItemMobileGrid.Value>
        <TimeWithTooltip
          timestamp={ item.timestamp }
          isLoading={ isLoading }
          color="text.secondary"
          display="inline-block"
        />
      </ListItemMobileGrid.Value>

      <ListItemMobileGrid.Label isLoading={ isLoading }>Status</ListItemMobileGrid.Label>
      <ListItemMobileGrid.Value>
        <UserOpStatus status={ item.status } loading={ isLoading }/>
      </ListItemMobileGrid.Value>

      { showSender && (
        <>
          <ListItemMobileGrid.Label isLoading={ isLoading }>Sender</ListItemMobileGrid.Label>
          <ListItemMobileGrid.Value>
            <AddressStringOrParam
              address={ item.address }
              isLoading={ isLoading }
              truncation="constant"
            />
          </ListItemMobileGrid.Value>
        </>
      ) }

      { showTx && (
        <>
          <ListItemMobileGrid.Label isLoading={ isLoading }>Tx hash</ListItemMobileGrid.Label>
          <ListItemMobileGrid.Value>
            <TxEntity
              hash={ item.transaction_hash }
              isLoading={ isLoading }
              noIcon
              truncation="constant_long"
            />
          </ListItemMobileGrid.Value>
        </>
      ) }

      <ListItemMobileGrid.Label isLoading={ isLoading }>Block</ListItemMobileGrid.Label>
      <ListItemMobileGrid.Value>
        <BlockEntity
          number={ Number(item.block_number) }
          isLoading={ isLoading }
          textStyle="sm"
          noIcon
        />
      </ListItemMobileGrid.Value>

      { !chainConfig.slices.tx.hiddenFields?.tx_fee && (
        <>
          <ListItemMobileGrid.Label isLoading={ isLoading }>Fee</ListItemMobileGrid.Label>
          <ListItemMobileGrid.Value>
            <NativeCoinValue
              amount={ item.fee }
              loading={ isLoading }
            />
          </ListItemMobileGrid.Value>
        </>
      ) }

    </ListItemMobileGrid.Container>
  );
};

export default UserOpsListItem;
