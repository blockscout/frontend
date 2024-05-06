import { Skeleton } from '@chakra-ui/react';
import React from 'react';

import type { EnsDomainEvent } from 'types/api/ens';

import dayjs from 'lib/date/dayjs';
import Tag from 'ui/shared/chakra/Tag';
import AddressEntity from 'ui/shared/entities/address/AddressEntity';
import TxEntity from 'ui/shared/entities/tx/TxEntity';
import ListItemMobileGrid from 'ui/shared/ListItemMobile/ListItemMobileGrid';

type Props = EnsDomainEvent & {
  isLoading?: boolean;
}

const NameDomainHistoryListItem = ({ isLoading, transaction_hash: transactionHash, timestamp, from_address: fromAddress, action }: Props) => {
  return (
    <ListItemMobileGrid.Container>
      <ListItemMobileGrid.Label isLoading={ isLoading }>Txn hash</ListItemMobileGrid.Label>
      <ListItemMobileGrid.Value>
        <TxEntity hash={ transactionHash } isLoading={ isLoading } fontWeight={ 500 } truncation="constant_long"/>
      </ListItemMobileGrid.Value>

      <ListItemMobileGrid.Label isLoading={ isLoading }>Age</ListItemMobileGrid.Label>
      <ListItemMobileGrid.Value>
        <Skeleton isLoaded={ !isLoading } color="text_secondary" display="inline-block">
          <span>{ dayjs(timestamp).fromNow() }</span>
        </Skeleton>
      </ListItemMobileGrid.Value>

      { fromAddress && (
        <>
          <ListItemMobileGrid.Label isLoading={ isLoading }>From</ListItemMobileGrid.Label>
          <ListItemMobileGrid.Value>
            <AddressEntity address={ fromAddress } isLoading={ isLoading } truncation="constant"/>
          </ListItemMobileGrid.Value>
        </>
      ) }

      { action && (
        <>
          <ListItemMobileGrid.Label isLoading={ isLoading }>Method</ListItemMobileGrid.Label>
          <ListItemMobileGrid.Value>
            <Tag colorScheme="gray" isLoading={ isLoading }>{ action }</Tag>
          </ListItemMobileGrid.Value>
        </>
      ) }
    </ListItemMobileGrid.Container>
  );
};

export default React.memo(NameDomainHistoryListItem);
