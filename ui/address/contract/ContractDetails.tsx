import type { UseQueryResult } from '@tanstack/react-query';
import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import type { Channel } from 'phoenix';
import React from 'react';

import type { SocketMessage } from 'lib/socket/types';
import type { Address as AddressInfo } from 'types/api/address';
import type { AddressImplementation } from 'types/api/addressParams';
import type { SmartContract } from 'types/api/contract';

import type { ResourceError } from 'lib/api/resources';
import useApiQuery, { getResourceKey } from 'lib/api/useApiQuery';
import getQueryParamString from 'lib/router/getQueryParamString';
import useSocketMessage from 'lib/socket/useSocketMessage';
import * as stubs from 'stubs/contract';
import DataFetchAlert from 'ui/shared/DataFetchAlert';
import RoutedTabs from 'ui/shared/Tabs/RoutedTabs';

import ContractDetailsAlerts from './alerts/ContractDetailsAlerts';
import ContractSourceAddressSelector from './ContractSourceAddressSelector';
import ContractDetailsInfo from './info/ContractDetailsInfo';
import useContractDetailsTabs from './useContractDetailsTabs';

const TAB_LIST_PROPS = { flexWrap: 'wrap', rowGap: 2 };

type Props = {
  addressHash: string;
  channel: Channel | undefined;
  mainContractQuery: UseQueryResult<SmartContract, ResourceError>;
};

const ContractDetails = ({ addressHash, channel, mainContractQuery }: Props) => {
  const router = useRouter();
  const sourceAddress = getQueryParamString(router.query.source_address);

  const queryClient = useQueryClient();
  const addressInfo = queryClient.getQueryData<AddressInfo>(getResourceKey('address', { pathParams: { hash: addressHash } }));

  const sourceItems: Array<AddressImplementation> = React.useMemo(() => {
    const currentAddressItem = { address: addressHash, name: addressInfo?.name || 'Contract' };
    if (!addressInfo || !addressInfo.implementations || addressInfo.implementations.length === 0) {
      return [ currentAddressItem ];
    }

    return [
      currentAddressItem,
      ...(addressInfo?.implementations.filter((item) => item.address !== addressHash && item.name) || []),
    ];
  }, [ addressInfo, addressHash ]);

  const [ selectedItem, setSelectedItem ] = React.useState(sourceItems.find((item) => item.address === sourceAddress) || sourceItems[0]);

  const contractQuery = useApiQuery('contract', {
    pathParams: { hash: selectedItem?.address },
    queryOptions: {
      enabled: Boolean(selectedItem?.address),
      refetchOnMount: false,
      placeholderData: addressInfo?.is_verified ? stubs.CONTRACT_CODE_VERIFIED : stubs.CONTRACT_CODE_UNVERIFIED,
    },
  });
  const { data, isPlaceholderData, isError } = contractQuery;

  const tabs = useContractDetailsTabs({ data, isLoading: isPlaceholderData, addressHash, sourceAddress: selectedItem.address });

  const handleContractWasVerifiedMessage: SocketMessage.SmartContractWasVerified['handler'] = React.useCallback(() => {
    queryClient.refetchQueries({
      queryKey: getResourceKey('address', { pathParams: { hash: addressHash } }),
    });
    queryClient.refetchQueries({
      queryKey: getResourceKey('contract', { pathParams: { hash: addressHash } }),
    });
  }, [ addressHash, queryClient ]);

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
        addressHash={ addressHash }
        channel={ channel }
      />
      { mainContractQuery.data?.is_verified && (
        <ContractDetailsInfo
          data={ mainContractQuery.data }
          isLoading={ mainContractQuery.isPlaceholderData }
          addressHash={ addressHash }
        />
      ) }
      <RoutedTabs
        tabs={ tabs }
        isLoading={ isPlaceholderData }
        variant="radio_group"
        size="sm"
        leftSlot={ addressSelector }
        tabListProps={ TAB_LIST_PROPS }
      />
    </>
  );
};

export default ContractDetails;
