import { Tabs, TabList, Tab, TabPanel, TabPanels } from '@chakra-ui/react';
import type { UseQueryResult } from '@tanstack/react-query';
import { useQueryClient } from '@tanstack/react-query';
import type { Channel } from 'phoenix';
import React from 'react';

import type { SocketMessage } from 'lib/socket/types';
// import type { Address as AddressInfo } from 'types/api/address';
import type { SmartContract } from 'types/api/contract';

import type { ResourceError } from 'lib/api/resources';
import { getResourceKey } from 'lib/api/useApiQuery';
import useSocketMessage from 'lib/socket/useSocketMessage';
import DataFetchAlert from 'ui/shared/DataFetchAlert';

import ContractDetailsAlerts from './alerts/ContractDetailsAlerts';
import ContractDetailsInfo from './info/ContractDetailsInfo';
import useContractDetailsTabs from './useContractDetailsTabs';

type Props = {
  addressHash?: string;
  contractQuery: UseQueryResult<SmartContract, ResourceError<unknown>>;
  channel: Channel | undefined;
}

const ContractDetails = ({ addressHash, contractQuery, channel }: Props) => {
  const queryClient = useQueryClient();
  // const addressInfo = queryClient.getQueryData<AddressInfo>(getResourceKey('address', { pathParams: { hash: addressHash } }));

  const { data, isPlaceholderData, isError } = contractQuery;

  const tabs = useContractDetailsTabs({ data, isPlaceholderData, addressHash });

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

  return (
    <>
      <ContractDetailsAlerts
        data={ data }
        isPlaceholderData={ isPlaceholderData }
        addressHash={ addressHash }
        channel={ channel }
      />
      { data?.is_verified && <ContractDetailsInfo data={ data } isPlaceholderData={ isPlaceholderData } addressHash={ addressHash }/> }
      <Tabs variant="radio_group" size="sm">
        <TabList>
          { tabs.map((tab) => (
            <Tab
              key={ tab.id }
              borderRadius="none"
              _notFirst={{
                borderLeftWidth: 0,
              }}
              _first={{
                borderTopLeftRadius: 'base',
                borderBottomLeftRadius: 'base',
              }}
              _last={{
                borderTopRightRadius: 'base',
                borderBottomRightRadius: 'base',
              }}
            >
              { tab.title }
            </Tab>
          )) }
        </TabList>
        <TabPanels>
          { tabs.map((tab) => (
            <TabPanel key={ tab.id }>{ tab.component }</TabPanel>
          )) }
        </TabPanels>
      </Tabs>
    </>
  );
};

export default ContractDetails;
