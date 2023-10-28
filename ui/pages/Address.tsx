import { Box, Flex, HStack, Icon } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React from 'react';

import type { RoutedTab } from 'ui/shared/Tabs/types';

import config from 'configs/app';
import iconSuccess from 'icons/status/success.svg';
import useApiQuery from 'lib/api/useApiQuery';
import { useAppContext } from 'lib/contexts/app';
import useContractTabs from 'lib/hooks/useContractTabs';
import useIsSafeAddress from 'lib/hooks/useIsSafeAddress';
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
import AddressFavoriteButton from 'ui/address/details/AddressFavoriteButton';
import AddressQrCode from 'ui/address/details/AddressQrCode';
import SolidityscanReport from 'ui/address/SolidityscanReport';
import AccountActionsMenu from 'ui/shared/AccountActionsMenu/AccountActionsMenu';
import TextAd from 'ui/shared/ad/TextAd';
import AddressAddToWallet from 'ui/shared/address/AddressAddToWallet';
import AddressEntity from 'ui/shared/entities/address/AddressEntity';
import EntityTags from 'ui/shared/EntityTags';
import NetworkExplorers from 'ui/shared/NetworkExplorers';
import PageTitle from 'ui/shared/Page/PageTitle';
import RoutedTabs from 'ui/shared/Tabs/RoutedTabs';
import TabsSkeleton from 'ui/shared/Tabs/TabsSkeleton';

const TOKEN_TABS = [ 'tokens_erc20', 'tokens_nfts', 'tokens_nfts_collection', 'tokens_nfts_list' ];

const AddressPageContent = () => {
  const router = useRouter();
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

  const isSafeAddress = useIsSafeAddress(!addressQuery.isPlaceholderData && addressQuery.data?.is_contract ? hash : undefined);

  const contractTabs = useContractTabs(addressQuery.data);

  const tabs: Array<RoutedTab> = React.useMemo(() => {
    return [
      {
        id: 'txs',
        title: 'Transactions',
        count: addressTabsCountersQuery.data?.transactions_count,
        component: <AddressTxs scrollRef={ tabsScrollRef }/>,
      },
      config.features.beaconChain.isEnabled && addressTabsCountersQuery.data?.withdrawals_count ?
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
        component: <AddressCoinBalance/>,
      },
      config.chain.verificationType === 'validation' && addressTabsCountersQuery.data?.validations_count ?
        {
          id: 'blocks_validated',
          title: 'Blocks validated',
          count: addressTabsCountersQuery.data?.validations_count,
          component: <AddressBlocksValidated scrollRef={ tabsScrollRef }/>,
        } :
        undefined,
      addressTabsCountersQuery.data?.logs_count ?
        {
          id: 'logs',
          title: 'Logs',
          count: addressTabsCountersQuery.data?.logs_count,
          component: <AddressLogs scrollRef={ tabsScrollRef }/>,
        } :
        undefined,
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
        !addressQuery.data?.is_contract ? { label: 'eoa', display_name: 'EOA' } : undefined,
        addressQuery.data?.implementation_address ? { label: 'proxy', display_name: 'Proxy' } : undefined,
        addressQuery.data?.token ? { label: 'token', display_name: 'Token' } : undefined,
        isSafeAddress ? { label: 'safe', display_name: 'Multisig: Safe' } : undefined,
      ] }
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

  const isLoading = addressQuery.isPlaceholderData;

  const titleSecondRow = (
    <Flex alignItems="center" w="100%" columnGap={ 2 } rowGap={ 2 } flexWrap={{ base: 'wrap', lg: 'nowrap' }}>
      <AddressEntity
        address={{ ...addressQuery.data, hash, name: '' }}
        isLoading={ isLoading }
        fontFamily="heading"
        fontSize="lg"
        fontWeight={ 500 }
        noLink
        isSafeAddress={ isSafeAddress }
      />
      { !isLoading && addressQuery.data?.is_contract && addressQuery.data.token &&
        <AddressAddToWallet token={ addressQuery.data.token } variant="button"/> }
      { !isLoading && !addressQuery.data?.is_contract && config.features.account.isEnabled && (
        <AddressFavoriteButton hash={ hash } watchListId={ addressQuery.data?.watchlist_address_id }/>
      ) }
      <AddressQrCode address={{ hash }} isLoading={ isLoading }/>
      <AccountActionsMenu isLoading={ isLoading }/>
      <HStack ml="auto" gap={ 2 }/>
      { addressQuery.data?.is_contract && config.UI.views.address.solidityscanEnabled && <SolidityscanReport hash={ hash }/> }
      <NetworkExplorers type="address" pathParam={ hash }/>
    </Flex>
  );

  return (
    <>
      <TextAd mb={ 6 }/>
      <PageTitle
        title={ `${ addressQuery.data?.is_contract ? 'Contract' : 'Address' } details` }
        backLink={ backLink }
        contentAfter={ tags }
        secondRow={ titleSecondRow }
        isLoading={ isLoading }
      />
      <AddressDetails addressQuery={ addressQuery } scrollRef={ tabsScrollRef }/>
      { /* should stay before tabs to scroll up with pagination */ }
      <Box ref={ tabsScrollRef }></Box>
      { (addressQuery.isPlaceholderData || addressTabsCountersQuery.isPlaceholderData) ? <TabsSkeleton tabs={ tabs }/> : content }
    </>
  );
};

export default AddressPageContent;
