// SPDX-License-Identifier: LicenseRef-Blockscout

import { HStack } from '@chakra-ui/react';
import BigNumber from 'bignumber.js';
import React from 'react';

import type { schemas } from '@blockscout/api-types';

import AddressEntity from 'src/slices/address/components/entity/AddressEntity';
import { Reputation } from 'src/slices/token/components/entity/TokenEntity';

import MetadataTags from 'src/features/address-metadata/components/tag/MetadataTags';

import ListItemMobile from 'src/shared/lists/ListItemMobile';
import NativeCoinValue from 'src/shared/values/entity/NativeCoinValue';

import { Skeleton } from 'src/toolkit/chakra/skeleton';

interface Props {
  data: schemas['HotContract'];
  isLoading?: boolean;
  exchangeRate: string | null;
}

const HotContractsListItem = ({ data, isLoading, exchangeRate }: Props) => {
  const protocolTags = data?.contract_address?.metadata?.tags?.filter(tag => tag.tagType === 'protocol');

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
        <MetadataTags
          isLoading={ isLoading }
          tags={ protocolTags }
          noColors
        />
      ) }
      <HStack>
        <Skeleton loading={ isLoading } fontWeight={ 500 } w="100px">Txn count</Skeleton>
        <Skeleton loading={ isLoading }>
          <span>{ Number(data.transactions_count).toLocaleString() }</span>
        </Skeleton>
      </HStack>
      <HStack>
        <Skeleton loading={ isLoading } fontWeight={ 500 } w="100px">Gas used</Skeleton>
        <Skeleton loading={ isLoading }>
          <span>{ BigNumber(data.total_gas_used || 0).toFormat() }</span>
        </Skeleton>
      </HStack>
      <HStack alignItems="flex-start">
        <Skeleton loading={ isLoading } fontWeight={ 500 } w="100px">Balance</Skeleton>
        <NativeCoinValue
          amount={ data.balance }
          loading={ isLoading }
          exchangeRate={ exchangeRate }
          flexWrap="wrap"
        />
      </HStack>
    </ListItemMobile>
  );
};

export default React.memo(HotContractsListItem);
