import { Skeleton } from '@chakra-ui/react';
import React from 'react';

import type { UserOpsItem } from 'types/api/userOps';

import config from 'configs/app';
import dayjs from 'lib/date/dayjs';
import CurrencyValue from 'ui/shared/CurrencyValue';
import AddressStringOrParam from 'ui/shared/entities/address/AddressStringOrParam';
import BlockEntity from 'ui/shared/entities/block/BlockEntity';
import TxEntity from 'ui/shared/entities/tx/TxEntity';
import UserOpEntity from 'ui/shared/entities/userOp/UserOpEntity';
import ListItemMobileGrid from 'ui/shared/ListItemMobile/ListItemMobileGrid';
import UserOpStatus from 'ui/shared/userOps/UserOpStatus';

type Props = {
  item: UserOpsItem;
  isLoading?: boolean;
  showTx: boolean;
  showSender: boolean;
};

const UserOpsListItem = ({ item, isLoading, showTx, showSender }: Props) => {
  const timeAgo = dayjs(item.timestamp).fromNow();

  return (
    <ListItemMobileGrid.Container gridTemplateColumns="100px auto">

      <ListItemMobileGrid.Label isLoading={ isLoading }>User op hash</ListItemMobileGrid.Label>
      <ListItemMobileGrid.Value>
        <UserOpEntity hash={ item.hash } isLoading={ isLoading } fontWeight="700" noIcon truncation="constant_long"/>
      </ListItemMobileGrid.Value>

      <ListItemMobileGrid.Label isLoading={ isLoading }>Age</ListItemMobileGrid.Label>
      <ListItemMobileGrid.Value>
        <Skeleton isLoaded={ !isLoading } color="text_secondary" display="inline-block"><span>{ timeAgo }</span></Skeleton>
      </ListItemMobileGrid.Value>

      <ListItemMobileGrid.Label isLoading={ isLoading }>Status</ListItemMobileGrid.Label>
      <ListItemMobileGrid.Value>
        <UserOpStatus status={ item.status } isLoading={ isLoading }/>
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
          number={ item.block_number }
          isLoading={ isLoading }
          fontSize="sm"
          lineHeight={ 5 }
          noIcon
        />
      </ListItemMobileGrid.Value>

      { !config.UI.views.tx.hiddenFields?.tx_fee && (
        <>
          <ListItemMobileGrid.Label isLoading={ isLoading }>Fee</ListItemMobileGrid.Label>
          <ListItemMobileGrid.Value>
            <Skeleton isLoaded={ !isLoading }>
              <CurrencyValue value={ item.fee } isLoading={ isLoading } accuracy={ 8 } currency={ config.chain.currency.symbol }/>
            </Skeleton>
          </ListItemMobileGrid.Value>
        </>
      ) }

    </ListItemMobileGrid.Container>
  );
};

export default UserOpsListItem;
