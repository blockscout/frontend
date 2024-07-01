import { Flex } from '@chakra-ui/react';
import React from 'react';

import type { AspectDetail } from '../../types/api/aspect';
import type { Address } from 'types/api/address';
import type { TokenInfo } from 'types/api/token';

import config from 'configs/app';
import AddressFavoriteButton from 'ui/address/details/AddressFavoriteButton';
import AddressQrCode from 'ui/address/details/AddressQrCode';
import AddressAddToWallet from 'ui/shared/address/AddressAddToWallet';
import AddressIcon from 'ui/shared/address/AddressIcon';
import AddressLink from 'ui/shared/address/AddressLink';
import AddressActionsMenu from 'ui/shared/AddressActions/Menu';
import CopyToClipboard from 'ui/shared/CopyToClipboard';

interface Props {
  address?: Pick<Address, 'hash' | 'is_contract' | 'implementation_name' | 'watchlist_names' | 'watchlist_address_id'>;
  aspect?: AspectDetail;
  token?: TokenInfo | null;
  isLinkDisabled?: boolean;
  isLoading?: boolean;
}

const AddressHeadingInfo = ({ address, token, isLinkDisabled, isLoading, aspect }: Props) => {
  const hash = address?.hash || aspect?.hash || '';
  return (
    <Flex alignItems="center">
      <AddressIcon aspect={ aspect } isLoading={ isLoading }/>
      <AddressLink
        type="address"
        hash={ hash }
        ml={ 2 }
        fontFamily="heading"
        fontSize="lg"
        fontWeight={ 500 }
        isDisabled={ isLinkDisabled }
        isLoading={ isLoading }
      />
      <CopyToClipboard text={ hash } isLoading={ isLoading }/>
      { address && !isLoading && address.is_contract && token && <AddressAddToWallet ml={ 2 } token={ token }/> }
      { address && !isLoading && !address.is_contract && config.features.account.isEnabled && (
        <AddressFavoriteButton hash={ address.hash } watchListId={ address.watchlist_address_id } ml={ 3 }/>
      ) }
      <AddressQrCode hash={ hash } ml={ 2 } isLoading={ isLoading } flexShrink={ 0 }/>
      { config.features.account.isEnabled && <AddressActionsMenu isLoading={ isLoading }/> }
    </Flex>
  );
};

export default AddressHeadingInfo;
