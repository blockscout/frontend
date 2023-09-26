import { Box, Icon } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React from 'react';

import type { TokenType } from 'types/api/token';
import type { RoutedTab } from 'ui/shared/Tabs/types';

import config from 'configs/app';
import iconSuccess from 'icons/status/success.svg';
import useApiQuery from 'lib/api/useApiQuery';
import { useAppContext } from 'lib/contexts/app';
import useContractTabs from 'lib/hooks/useContractTabs';
import useIsMobile from 'lib/hooks/useIsMobile';
import getQueryParamString from 'lib/router/getQueryParamString';
import { ADDRESS_INFO, ADDRESS_TABS_COUNTERS } from 'stubs/address';
import AddressBlocksValidated from 'ui/address/AddressBlocksValidated';
import AddressCoinBalance from 'ui/address/AddressCoinBalance';
import AddressContract from 'ui/address/AddressContract';
import AddressDetails from 'ui/address/AddressDetails';
import AddressInternalTxs from 'ui/address/AddressInternalTxs';
import AddressLogs from 'ui/address/AddressLogs';
import AddressTokens from 'ui/address/AddressTokens';
import AddressTokenTransfers from 'ui/address/AddressTokenTransfers';
import AddressTxs from 'ui/address/AddressTxs';
import AddressWithdrawals from 'ui/address/AddressWithdrawals';
import EntityTags from 'ui/shared/EntityTags';
import NetworkExplorers from 'ui/shared/NetworkExplorers';
import PageTitle from 'ui/shared/Page/PageTitle';
import RoutedTabs from 'ui/shared/Tabs/RoutedTabs';
import TabsSkeleton from 'ui/shared/Tabs/TabsSkeleton';

export const tokenTabsByType: Record<TokenType, string> = {
  'ERC-20': 'tokens_erc20',
  'ERC-721': 'tokens_erc721',
  'ERC-1155': 'tokens_erc1155',
} as const;

const TOKEN_TABS = Object.values(tokenTabsByType);

const AddressPageContent = () => {
  const router = useRouter();
  const isMobile = useIsMobile();
  const appProps = useAppContext();

  const tabsScrollRef = React.useRef<HTMLDivElement>(null);
  const hash = getQueryParamString(router.query.hash);

  const addressQuery = useApiQuery('address', {
    pathParams: { hash },
    queryOptions: {
      enabled: Boolean(hash),
      placeholderData: ADDRESS_INFO,
    },
  });

  const addressTabsCountersQuery = useApiQuery('address_tabs_counters', {
    pathParams: { hash },
    queryOptions: {
      enabled: Boolean(hash),
      placeholderData: ADDRESS_TABS_COUNTERS,
    },
  });

  const contractTabs = useContractTabs(addressQuery.data);

  const tabs: Array<RoutedTab> = React.useMemo(() => {
    return [
      {
        id: 'txs',
        title: 'Transactions',
        count: addressTabsCountersQuery.data?.transactions_count,
        component: <AddressTxs scrollRef={ tabsScrollRef }/>,
      },
      config.features.beaconChain.isEnabled ?
        {
          id: 'withdrawals',
          title: 'Withdrawals',
          count: addressTabsCountersQuery.data?.withdrawals_count,
          component: <AddressWithdrawals scrollRef={ tabsScrollRef }/>,
        } :
        undefined,
      {
        id: 'token_transfers',
        title: 'Token transfers',
        count: addressTabsCountersQuery.data?.token_transfers_count,
        component: <AddressTokenTransfers scrollRef={ tabsScrollRef }/>,
      },
      {
        id: 'tokens',
        title: 'Tokens',
        count: addressTabsCountersQuery.data?.token_balances_count,
        component: <AddressTokens/>,
        subTabs: TOKEN_TABS,
      },
      {
        id: 'internal_txns',
        title: 'Internal txns',
        count: addressTabsCountersQuery.data?.internal_txs_count,
        component: <AddressInternalTxs scrollRef={ tabsScrollRef }/>,
      },
      {
        id: 'coin_balance_history',
        title: 'Coin balance history',
        count: addressTabsCountersQuery.data?.coin_balances_count,
        component: <AddressCoinBalance/>,
      },
      config.chain.verificationType === 'validation' ?
        {
          id: 'blocks_validated',
          title: 'Blocks validated',
          count: addressTabsCountersQuery.data?.validations_count,
          component: <AddressBlocksValidated scrollRef={ tabsScrollRef }/>,
        } :
        undefined,
      {
        id: 'logs',
        title: 'Logs',
        count: addressTabsCountersQuery.data?.logs_count,
        component: <AddressLogs scrollRef={ tabsScrollRef }/>,
      },
      addressQuery.data?.is_contract ? {
        id: 'contract',
        title: () => {
          if (addressQuery.data.is_verified) {
            return (
              <>
                <span>Contract</span>
                <Icon as={ iconSuccess } boxSize="14px" color="green.500" ml={ 1 }/>
              </>
            );
          }

          return 'Contract';
        },
        component: <AddressContract tabs={ contractTabs }/>,
        subTabs: contractTabs.map(tab => tab.id),
      } : undefined,
    ].filter(Boolean);
  }, [ addressQuery.data, contractTabs, addressTabsCountersQuery.data ]);

  const tags = (
    <EntityTags
      data={ addressQuery.data }
      isLoading={ addressQuery.isPlaceholderData }
      tagsBefore={ [
        addressQuery.data?.is_contract ? { label: 'contract', display_name: 'Contract' } : { label: 'eoa', display_name: 'EOA' },
        addressQuery.data?.implementation_address ? { label: 'proxy', display_name: 'Proxy' } : undefined,
        addressQuery.data?.token ? { label: 'token', display_name: 'Token' } : undefined,
      ] }
      contentAfter={
        <NetworkExplorers type="address" pathParam={ hash } ml="auto" hideText={ isMobile }/>
      }
    />
  );

  const content = addressQuery.isError ? null : <RoutedTabs tabs={ tabs } tabListProps={{ mt: 8 }}/>;

  const backLink = React.useMemo(() => {
    const hasGoBackLink = appProps.referrer && appProps.referrer.includes('/accounts');

    if (!hasGoBackLink) {
      return;
    }

    return {
      label: 'Back to top accounts list',
      url: appProps.referrer,
    };
  }, [ appProps.referrer ]);

  return (
    <>
      <PageTitle
        title={ `${ addressQuery.data?.is_contract ? 'Contract' : 'Address' } details` }
        backLink={ backLink }
        contentAfter={ tags }
        isLoading={ addressQuery.isPlaceholderData }
      />
      <AddressDetails addressQuery={ addressQuery } scrollRef={ tabsScrollRef }/>
      { /* should stay before tabs to scroll up with pagination */ }
      <Box ref={ tabsScrollRef }></Box>
      { (addressQuery.isPlaceholderData || addressTabsCountersQuery.isPlaceholderData) ? <TabsSkeleton tabs={ tabs }/> : content }
    </>
  );
};

export default AddressPageContent;
