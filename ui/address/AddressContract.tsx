import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import React from 'react';

import type { SocketMessage } from 'lib/socket/types';
import type { Address } from 'types/api/address';

import { getResourceKey } from 'lib/api/useApiQuery';
import { SECOND } from 'lib/consts';
import delay from 'lib/delay';
import useIsMobile from 'lib/hooks/useIsMobile';
import getQueryParamString from 'lib/router/getQueryParamString';
import useSocketChannel from 'lib/socket/useSocketChannel';
import useSocketMessage from 'lib/socket/useSocketMessage';
import RoutedTabs from 'toolkit/components/RoutedTabs/RoutedTabs';

import type { TContractAutoVerificationStatus } from './contract/ContractAutoVerificationStatus';
import ContractAutoVerificationStatus from './contract/ContractAutoVerificationStatus';
import useContractTabs from './contract/useContractTabs';
import { CONTRACT_TAB_IDS } from './contract/utils';

interface Props {
  addressData: Address | undefined;
  isLoading?: boolean;
  hasMudTab?: boolean;
}

const AddressContract = ({ addressData, isLoading = false, hasMudTab }: Props) => {
  const [ isQueryEnabled, setIsQueryEnabled ] = React.useState(false);
  const [ autoVerificationStatus, setAutoVerificationStatus ] = React.useState<TContractAutoVerificationStatus | null>(null);

  const router = useRouter();
  const queryClient = useQueryClient();
  const isMobile = useIsMobile();
  const enableQuery = React.useCallback(() => {
    setIsQueryEnabled(true);
  }, []);

  const tab = getQueryParamString(router.query.tab);
  const isSocketEnabled = Boolean(addressData?.hash) && addressData?.is_contract && !isLoading && CONTRACT_TAB_IDS.concat('contract' as never).includes(tab);

  const channel = useSocketChannel({
    topic: `addresses:${ addressData?.hash?.toLowerCase() }`,
    isDisabled: !isSocketEnabled,
    onJoin: enableQuery,
    onSocketError: enableQuery,
  });

  const contractTabs = useContractTabs({
    addressData,
    isEnabled: isQueryEnabled,
    hasMudTab,
    channel,
  });

  const handleLookupStartedMessage: SocketMessage.EthBytecodeDbLookupStarted['handler'] = React.useCallback(() => {
    setAutoVerificationStatus('pending');
  }, []);

  const handleContractWasVerifiedMessage: SocketMessage.SmartContractWasVerified['handler'] = React.useCallback(async() => {
    setAutoVerificationStatus('success');
    await queryClient.refetchQueries({
      queryKey: getResourceKey('address', { pathParams: { hash: addressData?.hash } }),
    });
    await queryClient.refetchQueries({
      queryKey: getResourceKey('contract', { pathParams: { hash: addressData?.hash } }),
    });
    setAutoVerificationStatus(null);
  }, [ addressData?.hash, queryClient ]);

  const handleContractWasNotVerifiedMessage: SocketMessage.SmartContractWasNotVerified['handler'] = React.useCallback(async() => {
    setAutoVerificationStatus('failed');
    await delay(10 * SECOND);
    setAutoVerificationStatus(null);
  }, []);

  useSocketMessage({ channel, event: 'eth_bytecode_db_lookup_started', handler: handleLookupStartedMessage });
  useSocketMessage({ channel, event: 'smart_contract_was_verified', handler: handleContractWasVerifiedMessage });
  useSocketMessage({ channel, event: 'smart_contract_was_not_verified', handler: handleContractWasNotVerifiedMessage });

  if (isLoading) {
    return null;
  }

  const rightSlot = autoVerificationStatus ?
    <ContractAutoVerificationStatus status={ autoVerificationStatus } mode={ isMobile && contractTabs.tabs.length > 1 ? 'tooltip' : 'inline' }/> :
    null;

  return (
    <RoutedTabs
      tabs={ contractTabs.tabs }
      variant="secondary"
      size="sm"
      isLoading={ contractTabs.isLoading }
      rightSlot={ rightSlot }
      rightSlotProps={{ ml: contractTabs.tabs.length > 1 ? { base: 'auto', md: 6 } : 0 }}
    />
  );
};

export default React.memo(AddressContract);
