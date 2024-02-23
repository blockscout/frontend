import { Box, Flex, HStack } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React from 'react';

import type { RoutedTab } from 'ui/shared/Tabs/types';

import config from 'configs/app';
import useApiQuery from 'lib/api/useApiQuery';
import { useAppContext } from 'lib/contexts/app';
import useContractTabs from 'lib/hooks/useContractTabs';
import useIsSafeAddress from 'lib/hooks/useIsSafeAddress';
import getQueryParamString from 'lib/router/getQueryParamString';
import { ADDRESS_TABS_COUNTERS } from 'stubs/address';
import { USER_OPS_ACCOUNT } from 'stubs/userOps';
import AddressBlocksValidated from 'ui/address/AddressBlocksValidated';
import AddressCoinBalance from 'ui/address/AddressCoinBalance';
import AddressContract from 'ui/address/AddressContract';
import AddressDetails from 'ui/address/AddressDetails';
import AddressInternalTxs from 'ui/address/AddressInternalTxs';
import AddressLogs from 'ui/address/AddressLogs';
import AddressTokens from 'ui/address/AddressTokens';
import AddressTokenTransfers from 'ui/address/AddressTokenTransfers';
import AddressTxs from 'ui/address/AddressTxs';
import AddressUserOps from 'ui/address/AddressUserOps';
import AddressWithdrawals from 'ui/address/AddressWithdrawals';
import AddressFavoriteButton from 'ui/address/details/AddressFavoriteButton';
import AddressQrCode from 'ui/address/details/AddressQrCode';
import AddressEnsDomains from 'ui/address/ensDomains/AddressEnsDomains';
import SolidityscanReport from 'ui/address/SolidityscanReport';
import useAddressQuery from 'ui/address/utils/useAddressQuery';
import AccountActionsMenu from 'ui/shared/AccountActionsMenu/AccountActionsMenu';
import TextAd from 'ui/shared/ad/TextAd';
import AddressAddToWallet from 'ui/shared/address/AddressAddToWallet';
import AddressEntity from 'ui/shared/entities/address/AddressEntity';
import EnsEntity from 'ui/shared/entities/ens/EnsEntity';
import EntityTags from 'ui/shared/EntityTags';
import IconSvg from 'ui/shared/IconSvg';
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

  const addressQuery = useAddressQuery({ hash });

  const addressTabsCountersQuery = useApiQuery('address_tabs_counters', {
    pathParams: { hash },
    queryOptions: {
      enabled: Boolean(hash),
      placeholderData: ADDRESS_TABS_COUNTERS,
    },
  });

  const userOpsAccountQuery = useApiQuery('user_ops_account', {
    pathParams: { hash },
    queryOptions: {
      enabled: Boolean(hash) && config.features.userOps.isEnabled,
      placeholderData: USER_OPS_ACCOUNT,
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
      config.features.userOps.isEnabled && Boolean(userOpsAccountQuery.data?.total_ops) ?
        {
          id: 'user_ops',
          title: 'User operations',
          count: userOpsAccountQuery.data?.total_ops,
          component: <AddressUserOps/>,
        } :
        undefined,
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
                <IconSvg name="status/success" boxSize="14px" color="green.500" ml={ 1 }/>
              </>
            );
          }

          return 'Contract';
        },
        component: <AddressContract tabs={ contractTabs }/>,
        subTabs: contractTabs.map(tab => tab.id),
      } : undefined,
    ].filter(Boolean);
  }, [ addressQuery.data, contractTabs, addressTabsCountersQuery.data, userOpsAccountQuery.data ]);

  const isLoading = addressQuery.isPlaceholderData || (config.features.userOps.isEnabled && userOpsAccountQuery.isPlaceholderData);

  const tags = (
    <EntityTags
      data={ addressQuery.data }
      isLoading={ isLoading }
      tagsBefore={ [
        !addressQuery.data?.is_contract ? { label: 'eoa', display_name: 'EOA' } : undefined,
        config.features.validators.isEnabled && addressQuery.data?.has_validated_blocks ? { label: 'validator', display_name: 'Validator' } : undefined,
        addressQuery.data?.implementation_address ? { label: 'proxy', display_name: 'Proxy' } : undefined,
        addressQuery.data?.token ? { label: 'token', display_name: 'Token' } : undefined,
        isSafeAddress ? { label: 'safe', display_name: 'Multisig: Safe' } : undefined,
        config.features.userOps.isEnabled && userOpsAccountQuery.data ? { label: 'user_ops_acc', display_name: 'Smart contract wallet' } : undefined,
      ] }
    />
  );

  const content = (addressQuery.isError || addressQuery.isDegradedData) ? null : <RoutedTabs tabs={ tabs } tabListProps={{ mt: 8 }}/>;

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

  const titleSecondRow = (
    <Flex alignItems="center" w="100%" columnGap={ 2 } rowGap={ 2 } flexWrap={{ base: 'wrap', lg: 'nowrap' }}>
      { addressQuery.data?.ens_domain_name && (
        <EnsEntity
          name={ addressQuery.data?.ens_domain_name }
          fontFamily="heading"
          fontSize="lg"
          fontWeight={ 500 }
          mr={ 1 }
          maxW="300px"
        />
      ) }
      <AddressEntity
        address={{ ...addressQuery.data, hash, name: '', ens_domain_name: '' }}
        isLoading={ isLoading }
        fontFamily="heading"
        fontSize="lg"
        fontWeight={ 500 }
        noLink
        isSafeAddress={ isSafeAddress }
        mr={ 4 }
      />
      { !isLoading && addressQuery.data?.is_contract && addressQuery.data.token &&
        <AddressAddToWallet token={ addressQuery.data.token } variant="button"/> }
      { !isLoading && !addressQuery.data?.is_contract && config.features.account.isEnabled && (
        <AddressFavoriteButton hash={ hash } watchListId={ addressQuery.data?.watchlist_address_id }/>
      ) }
      <AddressQrCode address={{ hash }} isLoading={ isLoading }/>
      <AccountActionsMenu isLoading={ isLoading }/>
      <HStack ml="auto" gap={ 2 }/>
      { addressQuery.data?.is_contract && addressQuery.data?.is_verified && config.UI.views.address.solidityscanEnabled && <SolidityscanReport hash={ hash }/> }
      { !isLoading && addressQuery.data && config.features.nameService.isEnabled &&
        <AddressEnsDomains addressHash={ hash } mainDomainName={ addressQuery.data.ens_domain_name }/> }
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
      { (isLoading || addressTabsCountersQuery.isPlaceholderData) ?
        <TabsSkeleton tabs={ tabs }/> :
        content
      }
    </>
  );
};

export default AddressPageContent;
