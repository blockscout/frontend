import { HStack } from '@chakra-ui/react';
import React from 'react';

import type { TxAuthorization } from 'types/api/transaction';

import config from 'configs/app';
import Skeleton from 'ui/shared/chakra/Skeleton';
import AddressEntity from 'ui/shared/entities/address/AddressEntity';
import ListItemMobile from 'ui/shared/ListItemMobile/ListItemMobile';

interface Props extends TxAuthorization {
  isLoading?: boolean;
}

const TxAuthorizationsListItem = ({ address, authority, chain_id: chainId, nonce, isLoading }: Props) => {
  return (
    <ListItemMobile rowGap={ 3 } fontSize="sm">
      <HStack spacing={ 3 } w="100%">
        <Skeleton isLoaded={ !isLoading } fontWeight={ 500 }>Address</Skeleton>
        <AddressEntity address={{ hash: address }} isLoading={ isLoading } noIcon/>
      </HStack>
      <HStack spacing={ 3 } w="100%">
        <Skeleton isLoaded={ !isLoading } fontWeight={ 500 }>Authority</Skeleton>
        <AddressEntity address={{ hash: authority }} isLoading={ isLoading } noIcon/>
      </HStack>
      <HStack spacing={ 3 }>
        <Skeleton isLoaded={ !isLoading } fontWeight={ 500 }>Chain</Skeleton>
        <Skeleton isLoaded={ !isLoading } color="text_secondary">{ chainId === Number(config.chain.id) ? 'this' : 'any' }</Skeleton>
      </HStack>
      <HStack spacing={ 3 }>
        <Skeleton isLoaded={ !isLoading } fontWeight={ 500 }>Nonce</Skeleton>
        <Skeleton isLoaded={ !isLoading } color="text_secondary">{ nonce }</Skeleton>
      </HStack>
    </ListItemMobile>
  );
};

export default TxAuthorizationsListItem;
