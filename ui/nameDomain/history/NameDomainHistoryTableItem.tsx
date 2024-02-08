import { Tr, Td, Skeleton } from '@chakra-ui/react';
import React from 'react';

import type { EnsDomainEvent } from 'types/api/ens';

import dayjs from 'lib/date/dayjs';
import Tag from 'ui/shared/chakra/Tag';
import AddressEntity from 'ui/shared/entities/address/AddressEntity';
import TxEntity from 'ui/shared/entities/tx/TxEntity';

type Props = EnsDomainEvent & {
  isLoading?: boolean;
}

const NameDomainHistoryTableItem = ({ isLoading, transaction_hash: transactionHash, from_address: fromAddress, action, timestamp }: Props) => {

  return (
    <Tr>
      <Td verticalAlign="middle">
        <TxEntity
          hash={ transactionHash }
          isLoading={ isLoading }
          fontWeight={ 700 }
          noIcon
          truncation="constant_long"
        />
      </Td>
      <Td pl={ 9 } verticalAlign="middle">
        <Skeleton isLoaded={ !isLoading } color="text_secondary" display="inline-block">
          <span>{ dayjs(timestamp).fromNow() }</span>
        </Skeleton>
      </Td>
      <Td verticalAlign="middle">
        { fromAddress && <AddressEntity address={ fromAddress } isLoading={ isLoading } truncation="constant"/> }
      </Td>
      <Td verticalAlign="middle">
        { action && <Tag colorScheme="gray" isLoading={ isLoading }>{ action }</Tag> }
      </Td>
    </Tr>
  );
};

export default React.memo(NameDomainHistoryTableItem);
