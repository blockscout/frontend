import { HStack } from '@chakra-ui/react';
import React from 'react';

import type { HotContract } from 'types/api/contracts';

import { Skeleton } from 'toolkit/chakra/skeleton';
import AddressEntity from 'ui/shared/entities/address/AddressEntity';
import { Reputation } from 'ui/shared/entities/token/TokenEntity';
import EntityTags from 'ui/shared/EntityTags/EntityTags';
import ListItemMobile from 'ui/shared/ListItemMobile/ListItemMobile';

interface Props {
  data: HotContract;
  isLoading?: boolean;
}

const HotContractsListItem = ({ data, isLoading }: Props) => {
  const protocolTags = data?.contract_address?.metadata?.tags.filter(tag => tag.tagType === 'protocol');

  return (
    <ListItemMobile rowGap={ 3 } py={ 4 } textStyle="sm">
      <HStack justifyContent="space-between" width="100%">
        <AddressEntity
          address={ data.contract_address }
          isLoading={ isLoading }
        />
        <Reputation value={ data.contract_address.reputation ?? null }/>
      </HStack>
      { protocolTags && protocolTags.length > 0 && (
        <EntityTags
          isLoading={ isLoading }
          tags={ protocolTags }
        />
      ) }
      <HStack>
        <Skeleton loading={ isLoading } fontWeight={ 500 } w="100px">Txn count</Skeleton>
        <Skeleton loading={ isLoading }>
          <span>{ data.transactions_count }</span>
        </Skeleton>
      </HStack>
      <HStack>
        <Skeleton loading={ isLoading } fontWeight={ 500 } w="100px">Gas used</Skeleton>
        <Skeleton loading={ isLoading }>
          <span>{ data.total_gas_used }</span>
        </Skeleton>
      </HStack>
      <HStack>
        <Skeleton loading={ isLoading } fontWeight={ 500 } w="100px">Balance</Skeleton>
        <Skeleton loading={ isLoading }>
          <span>{ data.balance }</span>
        </Skeleton>
      </HStack>
    </ListItemMobile>
  );
};

export default React.memo(HotContractsListItem);
