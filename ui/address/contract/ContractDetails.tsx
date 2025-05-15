import { Box } from '@chakra-ui/react';
import type { UseQueryResult } from '@tanstack/react-query';
import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import type { Channel } from 'phoenix';
import React from 'react';

import type { SocketMessage } from 'lib/socket/types';
import type { Address } from 'types/api/address';
import type { AddressImplementation } from 'types/api/addressParams';
import type { SmartContract } from 'types/api/contract';

import type { ResourceError } from 'lib/api/resources';
import useApiQuery, { getResourceKey } from 'lib/api/useApiQuery';
import getQueryParamString from 'lib/router/getQueryParamString';
import useSocketMessage from 'lib/socket/useSocketMessage';
import * as stubs from 'stubs/contract';
import RoutedTabs from 'toolkit/components/RoutedTabs/RoutedTabs';
import DataFetchAlert from 'ui/shared/DataFetchAlert';

import ContractDetailsAlerts from './alerts/ContractDetailsAlerts';
import ContractSourceAddressSelector from './ContractSourceAddressSelector';
import ContractDetailsInfo from './info/ContractDetailsInfo';
import useContractDetailsTabs from './useContractDetailsTabs';

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

  const queryClient = useQueryClient();

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

  const [ selectedItem, setSelectedItem ] = React.useState(sourceItems.find((item) => item.address_hash === sourceAddress) || sourceItems[0]);

  const contractQuery = useApiQuery('general:contract', {
    pathParams: { hash: selectedItem?.address_hash },
    queryOptions: {
      enabled: Boolean(selectedItem?.address_hash && !mainContractQuery.isPlaceholderData),
      refetchOnMount: false,
      placeholderData: addressData?.is_verified ? stubs.CONTRACT_CODE_VERIFIED : stubs.CONTRACT_CODE_UNVERIFIED,
    },
  });
  const { data, isPlaceholderData, isError } = contractQuery;

  const tabs = useContractDetailsTabs({ data, isLoading: isPlaceholderData, addressData, sourceAddress: selectedItem.address_hash });

  const handleContractWasVerifiedMessage: SocketMessage.SmartContractWasVerified['handler'] = React.useCallback(() => {
    queryClient.refetchQueries({
      queryKey: getResourceKey('general:address', { pathParams: { hash: addressData.hash } }),
    });
    queryClient.refetchQueries({
      queryKey: getResourceKey('general:contract', { pathParams: { hash: addressData.hash } }),
    });
  }, [ addressData.hash, queryClient ]);

  useSocketMessage({
    channel,
    event: 'smart_contract_was_verified',
    handler: handleContractWasVerifiedMessage,
  });

  if (isError) {
    return <DataFetchAlert/>;
  }

  const addressSelector = sourceItems.length > 1 ? (
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
          addressHash={ addressData.hash }
        />
      ) }
      { tabs.length > 1 ? (
        <RoutedTabs
          tabs={ tabs }
          isLoading={ isPlaceholderData }
          variant="segmented"
          size="sm"
          leftSlot={ addressSelector }
          listProps={ TAB_LIST_PROPS }
          leftSlotProps={ LEFT_SLOT_PROPS }
        />
      ) : (
        <>
          { addressSelector && <Box mb={ 6 }>{ addressSelector }</Box> }
          <div>{ tabs[0].component }</div>
        </>
      ) }
    </>
  );
};

export default ContractDetails;
