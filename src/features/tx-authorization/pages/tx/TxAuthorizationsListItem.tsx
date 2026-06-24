// SPDX-License-Identifier: LicenseRef-Blockscout

import { HStack } from '@chakra-ui/react';
import React from 'react';

import type { schemas } from '@blockscout/api-types';

import AddressEntity from 'src/slices/address/components/entity/AddressEntity';

import TxAuthorizationStatus from 'src/features/tx-authorization/components/TxAuthorizationStatus';

import config from 'src/config';
import ListItemMobile from 'src/shared/lists/ListItemMobile';

import { Skeleton } from 'src/toolkit/chakra/skeleton';

interface Props {
  data: schemas['SignedAuthorization'];
  isLoading?: boolean;
}

const TxAuthorizationsListItem = ({ data, isLoading }: Props) => {
  return (
    <ListItemMobile rowGap={ 3 } fontSize="sm">
      <HStack gap={ 3 } w="100%">
        <Skeleton loading={ isLoading } fontWeight={ 500 }>Authority</Skeleton>
        <AddressEntity address={{ hash: data.authority }} isLoading={ isLoading } noIcon/>
      </HStack>
      <HStack gap={ 3 } w="100%">
        <Skeleton loading={ isLoading } fontWeight={ 500 } flexShrink={ 0 }>Delegated address</Skeleton>
        <AddressEntity address={{ hash: data.address_hash }} isLoading={ isLoading } noIcon/>
      </HStack>
      <HStack gap={ 3 }>
        <Skeleton loading={ isLoading } fontWeight={ 500 }>Chain</Skeleton>
        <Skeleton loading={ isLoading } color="text.secondary">{ data.chain_id === Number(config.chain.id) ? 'this' : 'any' }</Skeleton>
      </HStack>
      <HStack gap={ 3 }>
        <Skeleton loading={ isLoading } fontWeight={ 500 }>Nonce</Skeleton>
        <Skeleton loading={ isLoading } color="text.secondary">{ data.nonce }</Skeleton>
      </HStack>
      <HStack gap={ 3 }>
        <Skeleton loading={ isLoading } fontWeight={ 500 }>Status</Skeleton>
        <TxAuthorizationStatus status={ data.status } loading={ isLoading }/>
      </HStack>
    </ListItemMobile>
  );
};

export default TxAuthorizationsListItem;
