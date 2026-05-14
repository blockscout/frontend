// SPDX-License-Identifier: LicenseRef-Blockscout

import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import React from 'react';

import type { SocketMessage } from 'client/api/socket/types';
import type { Address } from 'client/slices/address/types/api';

import { getResourceKey } from 'client/api/hooks/useApiQuery';
import useSocketChannel from 'client/api/socket/useSocketChannel';
import useSocketMessage from 'client/api/socket/useSocketMessage';

import type { TContractAutoVerificationStatus } from 'client/slices/contract/pages/details/code/ContractAutoVerificationStatus';
import ContractAutoVerificationStatus from 'client/slices/contract/pages/details/code/ContractAutoVerificationStatus';
import useContractTabs from 'client/slices/contract/pages/details/useContractTabs';
import { CONTRACT_TAB_IDS } from 'client/slices/contract/utils/tabs';

import useIsMobile from 'client/shared/hooks/useIsMobile';
import getQueryParamString from 'client/shared/router/get-query-param-string';
import delay from 'client/shared/utils/delay';

import type { Props as RoutedTabsProps } from 'toolkit/components/AdaptiveTabs/AdaptiveTabs';
import RoutedTabs from 'toolkit/components/RoutedTabs/RoutedTabs';
import { SECOND } from 'toolkit/utils/consts';

interface Props extends Pick<RoutedTabsProps, 'leftSlot' | 'leftSlotProps'> {
  addressData: Address | undefined;
  isLoading?: boolean;
  hasMudTab?: boolean;
}

const AddressContract = ({ addressData, isLoading = false, hasMudTab, ...rest }: Props) => {
  const [ isQueryEnabled, setIsQueryEnabled ] = React.useState(false);
  const [ autoVerificationStatus, setAutoVerificationStatus ] = React.useState<TContractAutoVerificationStatus | null>(null);

  const router = useRouter();
  const queryClient = useQueryClient();
  const isMobile = useIsMobile();
  const handleChannelJoin = React.useCallback(() => {
    setIsQueryEnabled(true);
  }, []);
  const handleChannelError = React.useCallback(() => {
    setIsQueryEnabled(true);
  }, []);

  const tab = getQueryParamString(router.query.tab);
  const isSocketEnabled = Boolean(addressData?.hash) && addressData?.is_contract && !isLoading && CONTRACT_TAB_IDS.concat('contract' as never).includes(tab);

  const channel = useSocketChannel({
    topic: `addresses:${ addressData?.hash?.toLowerCase() }`,
    isDisabled: !isSocketEnabled,
    onJoin: handleChannelJoin,
    onSocketError: handleChannelError,
  });

  const contractTabs = useContractTabs({
    addressData,
    isEnabled: isQueryEnabled && !isLoading,
    hasMudTab,
    channel,
  });

  const handleLookupStartedMessage: SocketMessage.EthBytecodeDbLookupStarted['handler'] = React.useCallback(() => {
    setAutoVerificationStatus('pending');
  }, []);

  const handleContractWasVerifiedMessage: SocketMessage.SmartContractWasVerified['handler'] = React.useCallback(async() => {
    setAutoVerificationStatus('success');
    await queryClient.refetchQueries({
      queryKey: getResourceKey('general:address', { pathParams: { hash: addressData?.hash } }),
    });
    await queryClient.refetchQueries({
      queryKey: getResourceKey('general:contract', { pathParams: { hash: addressData?.hash } }),
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

  const rightSlot = autoVerificationStatus && !contractTabs.isPartiallyVerified ?
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
      { ...rest }
    />
  );
};

export default React.memo(AddressContract);
