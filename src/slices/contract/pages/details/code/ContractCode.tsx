// SPDX-License-Identifier: LicenseRef-Blockscout

import { Grid } from '@chakra-ui/react';
import type { UseQueryResult } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import type { Channel } from 'phoenix';
import React from 'react';

import type { Address, AddressImplementation } from 'src/slices/address/types/api';
import type { SmartContract } from 'src/slices/contract/types/api';

import useApiQuery from 'src/api/hooks/useApiQuery';
import type { ResourceError } from 'src/api/resources';

import * as stubs from 'src/slices/contract/stubs';

import { useMultichainContext } from 'src/features/multichain/context';

import ApiFetchAlert from 'src/shared/alerts/ApiFetchAlert';
import getQueryParamString from 'src/shared/router/get-query-param-string';

import RoutedTabs from 'src/toolkit/components/RoutedTabs/RoutedTabs';

import ContractDetailsAlerts from './alerts/ContractDetailsAlerts';
import ContractSourceAddressSelector from './ContractSourceAddressSelector';
import ContractDetailsInfo from './info/ContractDetailsInfo';
import ContractDetailsInfoCreator from './info/ContractDetailsInfoCreator';
import ContractDetailsInfoImplementations from './info/ContractDetailsInfoImplementations';
import useContractCodeTabs from './useContractCodeTabs';

const TAB_LIST_PROPS = { flexWrap: 'wrap', rowGap: 2 };
const LEFT_SLOT_PROPS = { w: { base: '100%', lg: 'auto' } };

type Props = {
  addressData: Address;
  channel: Channel | undefined;
  mainContractQuery: UseQueryResult<SmartContract, ResourceError>;
};

const ContractDetails = ({ addressData, channel, mainContractQuery }: Props) => {
  const router = useRouter();
  const sourceAddress = getQueryParamString(router.query.source_address);
  const multichainContext = useMultichainContext();

  const sourceItems: Array<AddressImplementation> = React.useMemo(() => {
    const currentAddressDefaultName = addressData?.proxy_type === 'eip7702' ? 'Current address' : 'Current contract';
    const currentAddressItem = { address_hash: addressData.hash, name: addressData?.name || currentAddressDefaultName };
    if (!addressData || !addressData.implementations || addressData.implementations.length === 0) {
      return [ currentAddressItem ];
    }

    return [
      currentAddressItem,
      ...(addressData?.implementations.filter((item) => item.address_hash !== addressData.hash && item.name) || []),
    ];
  }, [ addressData ]);

  const [ selectedItem, setSelectedItem ] = React.useState<AddressImplementation | undefined>(undefined);

  React.useEffect(() => {
    if (!mainContractQuery.isPlaceholderData) {
      setSelectedItem(sourceItems.find((item) => item.address_hash === sourceAddress) || sourceItems[0]);
    }
  }, [ mainContractQuery.isPlaceholderData, sourceAddress, sourceItems ]);

  const contractQuery = useApiQuery('core:contract', {
    pathParams: { hash: selectedItem?.address_hash },
    queryOptions: {
      enabled: Boolean(selectedItem?.address_hash && !mainContractQuery.isPlaceholderData && selectedItem.address_hash !== addressData.hash),
      refetchOnMount: false,
      placeholderData: addressData?.is_verified ? stubs.CONTRACT_CODE_VERIFIED : stubs.CONTRACT_CODE_UNVERIFIED,
    },
  });
  const { data, isPlaceholderData, isError } = selectedItem?.address_hash !== addressData.hash ? contractQuery : mainContractQuery;

  const tabs = useContractCodeTabs({ data, isLoading: isPlaceholderData, addressData, sourceAddress: selectedItem?.address_hash });

  if (isError) {
    return <ApiFetchAlert/>;
  }

  const addressSelector = sourceItems.length > 1 && selectedItem ? (
    <ContractSourceAddressSelector
      isLoading={ mainContractQuery.isPlaceholderData }
      label="Source code"
      items={ sourceItems }
      selectedItem={ selectedItem }
      onItemSelect={ setSelectedItem }
      mr={{ lg: 8 }}
    />
  ) : null;

  return (
    <>
      <ContractDetailsAlerts
        data={ mainContractQuery.data }
        isLoading={ mainContractQuery.isPlaceholderData }
        addressData={ addressData }
        channel={ channel }
      />
      { mainContractQuery.data?.is_verified && (
        <ContractDetailsInfo
          data={ mainContractQuery.data }
          isLoading={ mainContractQuery.isPlaceholderData }
          addressData={ addressData }
        />
      ) }
      { !mainContractQuery.data?.is_verified && multichainContext && (
        <Grid templateColumns={{ base: 'auto 1fr', lg: 'auto 1fr auto 1fr' }} rowGap={ 4 } columnGap={ 3 } mb={ 8 } _empty={{ display: 'none' }}>
          { addressData.creator_address_hash && addressData.creation_transaction_hash && (
            <ContractDetailsInfoCreator
              addressHash={ addressData.creator_address_hash }
              txHash={ addressData.creation_transaction_hash }
              creationStatus={ addressData.creation_status }
              isLoading={ mainContractQuery.isPlaceholderData }
            />
          ) }
          { addressData.implementations && addressData.implementations.length > 0 && !mainContractQuery.isPlaceholderData && (
            <ContractDetailsInfoImplementations
              implementations={ addressData.implementations }
              proxyType={ addressData.proxy_type }
            />
          ) }
        </Grid>
      ) }
      <RoutedTabs
        tabs={ tabs }
        isLoading={ isPlaceholderData }
        variant="segmented"
        size="sm"
        leftSlot={ addressSelector }
        listProps={ TAB_LIST_PROPS }
        leftSlotProps={ LEFT_SLOT_PROPS }
      />
    </>
  );
};

export default ContractDetails;
