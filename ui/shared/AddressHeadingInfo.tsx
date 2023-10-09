import { Flex } from '@chakra-ui/react';
import React from 'react';

import type { Address } from 'types/api/address';
import type { TokenInfo } from 'types/api/token';

import config from 'configs/app';
import useIsSafeAddress from 'lib/hooks/useIsSafeAddress';
import stripTrailingSlash from 'lib/stripTrailingSlash';
import AddressFavoriteButton from 'ui/address/details/AddressFavoriteButton';
import AddressQrCode from 'ui/address/details/AddressQrCode';
import AddressAddToWallet from 'ui/shared/address/AddressAddToWallet';
import AddressActionsMenu from 'ui/shared/AddressActions/Menu';
import AddressEntity from 'ui/shared/entities/address/AddressEntity';
import LinkExternal from 'ui/shared/LinkExternal';

interface Props {
  address?: Pick<Address, 'hash' | 'is_contract' | 'implementation_name' | 'watchlist_names' | 'watchlist_address_id'>;
  token?: TokenInfo | null;
  isLinkDisabled?: boolean;
  isLoading?: boolean;
}

const AddressHeadingInfo = ({ address, token, isLinkDisabled, isLoading }: Props) => {
  const isSafeAddress = useIsSafeAddress(!isLoading && address?.is_contract ? address.hash : undefined);

  if (!address) {
    return null;
  }

  const tokenOriginalLink = (() => {
    const feature = config.features.bridgedTokens;
    if (!token?.foreign_address || !token.origin_chain_id || !feature.isEnabled) {
      return null;
    }

    const chainBaseUrl = feature.chains.find(({ id }) => id === token.origin_chain_id)?.base_url;

    if (!chainBaseUrl) {
      return null;
    }

    try {
      const url = new URL(stripTrailingSlash(chainBaseUrl) + '/' + token.foreign_address);
      return (
        <LinkExternal href={ url } variant="subtle" ml="auto">
          Original token
        </LinkExternal>
      );
    } catch (error) {
      return null;
    }
  })();

  return (
    <Flex alignItems="center" flexWrap={{ base: tokenOriginalLink ? 'wrap' : 'nowrap', lg: 'nowrap' }} rowGap={ 3 } columnGap={ 2 }>
      <AddressEntity
        address={{ ...address, name: '' }}
        isLoading={ isLoading }
        fontFamily="heading"
        fontSize="lg"
        fontWeight={ 500 }
        noLink={ isLinkDisabled }
        isSafeAddress={ isSafeAddress }
      />
      { !isLoading && address?.is_contract && token && <AddressAddToWallet token={ token }/> }
      { !isLoading && !address.is_contract && config.features.account.isEnabled && (
        <AddressFavoriteButton hash={ address.hash } watchListId={ address.watchlist_address_id }/>
      ) }
      <AddressQrCode address={ address } isLoading={ isLoading } flexShrink={ 0 }/>
      { config.features.account.isEnabled && <AddressActionsMenu isLoading={ isLoading }/> }
      { tokenOriginalLink }
    </Flex>
  );
};

export default AddressHeadingInfo;
