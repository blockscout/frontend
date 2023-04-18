import { Flex } from '@chakra-ui/react';
import React from 'react';

import type { Address } from 'types/api/address';
import type { TokenInfo } from 'types/api/token';

import appConfig from 'configs/app/config';
import useIsMobile from 'lib/hooks/useIsMobile';
import AddressAddToMetaMask from 'ui/address/details/AddressAddToMetaMask';
import AddressFavoriteButton from 'ui/address/details/AddressFavoriteButton';
import AddressQrCode from 'ui/address/details/AddressQrCode';
import AddressIcon from 'ui/shared/address/AddressIcon';
import AddressLink from 'ui/shared/address/AddressLink';
import AddressActionsMenu from 'ui/shared/AddressActions/Menu';
import CopyToClipboard from 'ui/shared/CopyToClipboard';

interface Props {
  address: Pick<Address, 'hash' | 'is_contract' | 'implementation_name' | 'watchlist_names' | 'watchlist_address_id'>;
  token?: TokenInfo | null;
  isLinkDisabled?: boolean;
}

const AddressHeadingInfo = ({ address, token, isLinkDisabled }: Props) => {
  const isMobile = useIsMobile();

  return (
    <Flex alignItems="center">
      <AddressIcon address={ address }/>
      <AddressLink
        type="address"
        hash={ address.hash }
        ml={ 2 }
        fontFamily="heading"
        fontWeight={ 500 }
        truncation={ isMobile ? 'constant' : 'none' }
        isDisabled={ isLinkDisabled }
      />
      <CopyToClipboard text={ address.hash }/>
      { address.is_contract && token && <AddressAddToMetaMask ml={ 2 } token={ token }/> }
      { !address.is_contract && appConfig.isAccountSupported && (
        <AddressFavoriteButton hash={ address.hash } watchListId={ address.watchlist_address_id } ml={ 3 }/>
      ) }
      <AddressQrCode hash={ address.hash } ml={ 2 }/>
      { appConfig.isAccountSupported && <AddressActionsMenu/> }
    </Flex>
  );
};

export default AddressHeadingInfo;
