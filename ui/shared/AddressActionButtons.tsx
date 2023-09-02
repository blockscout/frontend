import { Flex, Skeleton } from '@chakra-ui/react';
import React from 'react';

import type { Address } from 'types/api/address';
import type { TokenInfo } from 'types/api/token';

import config from 'configs/app';
import AddressFavoriteButton from 'ui/address/details/AddressFavoriteButton';
import AddressQrCode from 'ui/address/details/AddressQrCode';
import AddressAddToWallet from 'ui/shared/address/AddressAddToWallet';
import AddressActionsMenu from 'ui/shared/AddressActions/Menu';

interface Props {
  address: Pick<Address, 'hash' | 'is_contract' | 'implementation_name' | 'watchlist_address_id'> | undefined;
  token?: TokenInfo | null;
  isLoading?: boolean;
}

const AddressActionButtons = ({ address, token, isLoading }: Props) => {
  if (isLoading) {
    return (
      <Flex columnGap={ 2 }>
        <Skeleton isLoaded={ !isLoading } w="36px" h="32px" borderRadius="base"/>
        { config.features.account.isEnabled && <Skeleton isLoaded={ !isLoading } w="87px" h="32px" borderRadius="base"/> }
      </Flex>
    );
  }

  if (!address) {
    return null;
  }

  return (
    <Flex columnGap={ 2 }>
      { !isLoading && address.is_contract && token && <AddressAddToWallet token={ token } variant="button"/> }
      { !isLoading && !address.is_contract && config.features.account.isEnabled && (
        <AddressFavoriteButton hash={ address.hash } watchListId={ address.watchlist_address_id }/>
      ) }
      <AddressQrCode hash={ address.hash } flexShrink={ 0 }/>
      { config.features.account.isEnabled && <AddressActionsMenu/> }
    </Flex>
  );
};

export default AddressActionButtons;
