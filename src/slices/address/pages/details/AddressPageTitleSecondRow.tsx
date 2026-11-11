// SPDX-License-Identifier: LicenseRef-Blockscout

import { Flex, HStack } from '@chakra-ui/react';
import type { UseQueryResult } from '@tanstack/react-query';
import React from 'react';

import type * as bens from '@blockscout/bens-types';

import type { ResourceError } from 'src/api/resources';

import ActionsMenu from 'src/shell/page/actions-menu/ActionsMenu';

import AddressEntity from 'src/slices/address/components/entity/AddressEntity';
import type { AddressQuery } from 'src/slices/address/hooks/useAddressQuery';
import AddressQrCode from 'src/slices/address/pages/details/info/AddressQrCode';

import AddressFavoriteButton from 'src/features/account/pages/address/AddressFavoriteButton';
import AlternativeExplorers from 'src/features/alternative-explorers/components/AlternativeExplorers';
import type { useAddressClusters } from 'src/features/name-services/clusters/hooks/useAddressClusters';
import AddressClusters from 'src/features/name-services/clusters/pages/address/AddressClusters';
import EnsEntity from 'src/features/name-services/domains/components/EnsEntity';
import AddressEnsDomains from 'src/features/name-services/domains/pages/address/AddressEnsDomains';
import SolidityscanReport from 'src/features/solidity-scan/components/SolidityscanReport';
import TokenAddToWallet from 'src/features/web3-wallet/components/TokenAddToWallet';

import config from 'src/config';

const nameServicesFeature = config.features.nameServices;

interface Props {
  hash: string;
  checkSummedHash: string;
  addressQuery: AddressQuery;
  addressEnsDomainsQuery: UseQueryResult<bens.LookupAddressResponse, ResourceError<unknown>>;
  addressMainDomain: bens.Domain | undefined;
  addressClustersQuery: ReturnType<typeof useAddressClusters>;
  isSafeAddress: boolean;
  isLoading: boolean;
}

const AddressPageTitleSecondRow = ({
  hash,
  checkSummedHash,
  addressQuery,
  addressEnsDomainsQuery,
  addressMainDomain,
  addressClustersQuery,
  isSafeAddress,
  isLoading,
}: Props) => {
  const addressData = addressQuery.data;
  const isContract = Boolean(addressData?.is_contract);

  const protocolDapp = React.useMemo(() => {
    return {
      url: addressMainDomain?.protocol_dapp_url,
      logo: addressMainDomain?.protocol_dapp_logo,
    };
  }, [ addressMainDomain?.protocol_dapp_url, addressMainDomain?.protocol_dapp_logo ]);

  const showsSolidityscan = !isLoading && isContract && Boolean(addressData?.is_verified) && config.slices.contract.solidityscanEnabled;
  const showsEnsDomains = !isLoading && nameServicesFeature.isEnabled && nameServicesFeature.ens.isEnabled;
  const showsClusters = !isLoading && nameServicesFeature.isEnabled && nameServicesFeature.clusters.isEnabled;

  return (
    <Flex alignItems="center" w="100%" columnGap={ 2 } rowGap={ 2 } flexWrap={{ base: 'wrap', lg: 'nowrap' }}>
      { addressData?.ens_domain_name && (
        <EnsEntity
          domain={ addressData.ens_domain_name }
          protocol={ !addressEnsDomainsQuery.isPending ? addressMainDomain?.protocol : null }
          protocolDapp={ !addressEnsDomainsQuery.isPending ? protocolDapp : undefined }
          variant="subheading"
          mr={ 1 }
          maxW="300px"
        />
      ) }
      <AddressEntity
        address={{
          ...addressData,
          hash: checkSummedHash,
          name: '',
          ens_domain_name: '',
          implementations: [],
        }}
        isLoading={ isLoading }
        variant="subheading"
        noLink
        isSafeAddress={ isSafeAddress }
        icon={{ color: isSafeAddress ? { _light: 'black', _dark: 'white' } : undefined }}
      />
      { !isLoading && isContract && addressData?.token &&
        <TokenAddToWallet token={ addressData.token } variant="button"/> }
      { !isLoading && !isContract && config.features.account.isEnabled && (
        <AddressFavoriteButton hash={ hash } watchListId={ addressData?.watchlist_address_id }/>
      ) }
      <AddressQrCode hash={ addressData?.filecoin?.robust ?? checkSummedHash } isLoading={ isLoading }/>
      <ActionsMenu isLoading={ isLoading }/>
      <HStack ml="auto" gap={ 2 }/>
      { showsSolidityscan && <SolidityscanReport hash={ hash }/> }
      { showsEnsDomains &&
        <AddressEnsDomains query={ addressEnsDomainsQuery } addressHash={ hash } mainDomainName={ addressData?.ens_domain_name }/> }
      { showsClusters && <AddressClusters query={ addressClustersQuery } addressHash={ hash }/> }
      <AlternativeExplorers type="address" pathParam={ hash }/>
    </Flex>
  );
};

export default React.memo(AddressPageTitleSecondRow);
