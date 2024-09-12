import { Box, Flex, HStack, useColorModeValue } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React from 'react';

import type { EntityTag } from 'ui/shared/EntityTags/types';
import type { RoutedTab } from 'ui/shared/Tabs/types';

import config from 'configs/app';
import useAddressMetadataInfoQuery from 'lib/address/useAddressMetadataInfoQuery';
import useApiQuery from 'lib/api/useApiQuery';
import { useAppContext } from 'lib/contexts/app';
import useContractTabs from 'lib/hooks/useContractTabs';
import useIsSafeAddress from 'lib/hooks/useIsSafeAddress';
import getNetworkValidationActionText from 'lib/networks/getNetworkValidationActionText';
import getQueryParamString from 'lib/router/getQueryParamString';
import useSocketChannel from 'lib/socket/useSocketChannel';
import useSocketMessage from 'lib/socket/useSocketMessage';
import { ADDRESS_TABS_COUNTERS } from 'stubs/address';
import { USER_OPS_ACCOUNT } from 'stubs/userOps';
import AddressAccountHistory from 'ui/address/AddressAccountHistory';
import AddressBlocksValidated from 'ui/address/AddressBlocksValidated';
import AddressCoinBalance from 'ui/address/AddressCoinBalance';
import AddressContract from 'ui/address/AddressContract';
import AddressDetails from 'ui/address/AddressDetails';
import AddressInternalTxs from 'ui/address/AddressInternalTxs';
import AddressLogs from 'ui/address/AddressLogs';
import AddressMud from 'ui/address/AddressMud';
import AddressTokens from 'ui/address/AddressTokens';
import AddressTokenTransfers from 'ui/address/AddressTokenTransfers';
import AddressTxs from 'ui/address/AddressTxs';
import AddressUserOps from 'ui/address/AddressUserOps';
import AddressWithdrawals from 'ui/address/AddressWithdrawals';
import AddressFavoriteButton from 'ui/address/details/AddressFavoriteButton';
import AddressMetadataAlert from 'ui/address/details/AddressMetadataAlert';
import AddressQrCode from 'ui/address/details/AddressQrCode';
import AddressEnsDomains from 'ui/address/ensDomains/AddressEnsDomains';
import SolidityscanReport from 'ui/address/SolidityscanReport';
import useAddressQuery from 'ui/address/utils/useAddressQuery';
import useCheckDomainNameParam from 'ui/address/utils/useCheckDomainNameParam';
import AccountActionsMenu from 'ui/shared/AccountActionsMenu/AccountActionsMenu';
import TextAd from 'ui/shared/ad/TextAd';
import AddressAddToWallet from 'ui/shared/address/AddressAddToWallet';
import AddressEntity from 'ui/shared/entities/address/AddressEntity';
import EnsEntity from 'ui/shared/entities/ens/EnsEntity';
import EntityTags from 'ui/shared/EntityTags/EntityTags';
import formatUserTags from 'ui/shared/EntityTags/formatUserTags';
import sortEntityTags from 'ui/shared/EntityTags/sortEntityTags';
import IconSvg from 'ui/shared/IconSvg';
import NetworkExplorers from 'ui/shared/NetworkExplorers';
import PageTitle from 'ui/shared/Page/PageTitle';
import RoutedTabs from 'ui/shared/Tabs/RoutedTabs';

const TOKEN_TABS = [ 'tokens_erc20', 'tokens_nfts', 'tokens_nfts_collection', 'tokens_nfts_list' ];

const txInterpretation = config.features.txInterpretation;

const AddressPageContent = () => {
  const router = useRouter();
  const appProps = useAppContext();

  const tabsScrollRef = React.useRef<HTMLDivElement>(null);
  const hash = getQueryParamString(router.query.hash);

  const areQueriesEnabled = !useCheckDomainNameParam(hash);
  const addressQuery = useAddressQuery({ hash, isEnabled: areQueriesEnabled });

  const addressTabsCountersQuery = useApiQuery('address_tabs_counters', {
    pathParams: { hash },
    queryOptions: {
      enabled: areQueriesEnabled && Boolean(hash),
      placeholderData: ADDRESS_TABS_COUNTERS,
    },
  });

  const userOpsAccountQuery = useApiQuery('user_ops_account', {
    pathParams: { hash },
    queryOptions: {
      enabled: areQueriesEnabled && Boolean(hash) && config.features.userOps.isEnabled,
      placeholderData: USER_OPS_ACCOUNT,
    },
  });

  const mudTablesCountQuery = useApiQuery('address_mud_tables_count', {
    pathParams: { hash },
    queryOptions: {
      enabled: config.features.mudFramework.isEnabled && areQueriesEnabled && Boolean(hash),
      placeholderData: 10,
    },
  });

  const addressesForMetadataQuery = React.useMemo(() => ([ hash ].filter(Boolean)), [ hash ]);
  const addressMetadataQuery = useAddressMetadataInfoQuery(addressesForMetadataQuery, areQueriesEnabled);

  const addressEnsDomainsQuery = useApiQuery('addresses_lookup', {
    pathParams: { chainId: config.chain.id },
    queryParams: {
      address: hash,
      resolved_to: true,
      owned_by: true,
      only_active: true,
      order: 'ASC',
    },
    queryOptions: {
      enabled: Boolean(hash) && config.features.nameService.isEnabled,
    },
  });
  const addressMainDomain = !addressQuery.isPlaceholderData ?
    addressEnsDomainsQuery.data?.items.find((domain) => domain.name === addressQuery.data?.ens_domain_name) :
    undefined;

  const isLoading = addressQuery.isPlaceholderData;
  const isTabsLoading =
    isLoading ||
    addressTabsCountersQuery.isPlaceholderData ||
    (config.features.userOps.isEnabled && userOpsAccountQuery.isPlaceholderData) ||
    (config.features.mudFramework.isEnabled && mudTablesCountQuery.isPlaceholderData);

  const handleFetchedBytecodeMessage = React.useCallback(() => {
    addressQuery.refetch();
  }, [ addressQuery ]);

  const channel = useSocketChannel({
    topic: `addresses:${ hash?.toLowerCase() }`,
    isDisabled: isTabsLoading || addressQuery.isDegradedData || Boolean(addressQuery.data?.is_contract),
  });
  useSocketMessage({
    channel,
    event: 'fetched_bytecode',
    handler: handleFetchedBytecodeMessage,
  });

  const isSafeAddress = useIsSafeAddress(!addressQuery.isPlaceholderData && addressQuery.data?.is_contract ? hash : undefined);
  const safeIconColor = useColorModeValue('black', 'white');

  const contractTabs = useContractTabs(addressQuery.data, addressQuery.isPlaceholderData);

  const tabs: Array<RoutedTab> = React.useMemo(() => {
    return [
      config.features.mudFramework.isEnabled && mudTablesCountQuery.data && mudTablesCountQuery.data > 0 && {
        id: 'mud',
        title: 'MUD',
        count: mudTablesCountQuery.data,
        component: <AddressMud scrollRef={ tabsScrollRef } shouldRender={ !isTabsLoading } isQueryEnabled={ areQueriesEnabled }/>,
      },
      {
        id: 'txs',
        title: 'Transactions',
        count: addressTabsCountersQuery.data?.transactions_count,
        component: <AddressTxs scrollRef={ tabsScrollRef } shouldRender={ !isTabsLoading } isQueryEnabled={ areQueriesEnabled }/>,
      },
      txInterpretation.isEnabled && txInterpretation.provider === 'noves' ?
        {
          id: 'account_history',
          title: 'Account history',
          component: <AddressAccountHistory scrollRef={ tabsScrollRef } shouldRender={ !isTabsLoading } isQueryEnabled={ areQueriesEnabled }/>,
        } :
        undefined,
      config.features.userOps.isEnabled && Boolean(userOpsAccountQuery.data?.total_ops) ?
        {
          id: 'user_ops',
          title: 'User operations',
          count: userOpsAccountQuery.data?.total_ops,
          component: <AddressUserOps shouldRender={ !isTabsLoading } isQueryEnabled={ areQueriesEnabled }/>,
        } :
        undefined,
      config.features.beaconChain.isEnabled && addressTabsCountersQuery.data?.withdrawals_count ?
        {
          id: 'withdrawals',
          title: 'Withdrawals',
          count: addressTabsCountersQuery.data?.withdrawals_count,
          component: <AddressWithdrawals scrollRef={ tabsScrollRef } shouldRender={ !isTabsLoading } isQueryEnabled={ areQueriesEnabled }/>,
        } :
        undefined,
      {
        id: 'token_transfers',
        title: 'Token transfers',
        count: addressTabsCountersQuery.data?.token_transfers_count,
        component: <AddressTokenTransfers scrollRef={ tabsScrollRef } shouldRender={ !isTabsLoading } isQueryEnabled={ areQueriesEnabled }/>,
      },
      {
        id: 'tokens',
        title: 'Tokens',
        count: addressTabsCountersQuery.data?.token_balances_count,
        component: <AddressTokens shouldRender={ !isTabsLoading } isQueryEnabled={ areQueriesEnabled }/>,
        subTabs: TOKEN_TABS,
      },
      {
        id: 'internal_txns',
        title: 'Internal txns',
        count: addressTabsCountersQuery.data?.internal_txs_count,
        component: <AddressInternalTxs scrollRef={ tabsScrollRef } shouldRender={ !isTabsLoading } isQueryEnabled={ areQueriesEnabled }/>,
      },
      {
        id: 'coin_balance_history',
        title: 'Coin balance history',
        component: <AddressCoinBalance shouldRender={ !isTabsLoading } isQueryEnabled={ areQueriesEnabled }/>,
      },
      addressTabsCountersQuery.data?.validations_count ?
        {
          id: 'blocks_validated',
          title: `Blocks ${ getNetworkValidationActionText() }`,
          count: addressTabsCountersQuery.data?.validations_count,
          component: <AddressBlocksValidated scrollRef={ tabsScrollRef } shouldRender={ !isTabsLoading } isQueryEnabled={ areQueriesEnabled }/>,
        } :
        undefined,
      addressTabsCountersQuery.data?.logs_count ?
        {
          id: 'logs',
          title: 'Logs',
          count: addressTabsCountersQuery.data?.logs_count,
          component: <AddressLogs scrollRef={ tabsScrollRef } shouldRender={ !isTabsLoading } isQueryEnabled={ areQueriesEnabled }/>,
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
        component: (
          <AddressContract
            tabs={ contractTabs.tabs }
            shouldRender={ !isTabsLoading }
            isLoading={ contractTabs.isLoading }
          />
        ),
        subTabs: contractTabs.tabs.map(tab => tab.id),
      } : undefined,
    ].filter(Boolean);
  }, [
    addressQuery.data,
    contractTabs,
    addressTabsCountersQuery.data,
    userOpsAccountQuery.data,
    isTabsLoading,
    areQueriesEnabled,
    mudTablesCountQuery.data,
  ]);

  const tags: Array<EntityTag> = React.useMemo(() => {
    return [
      ...(addressQuery.data?.public_tags?.map((tag) => ({ slug: tag.label, name: tag.display_name, tagType: 'custom' as const, ordinal: -1 })) || []),
      !addressQuery.data?.is_contract ? { slug: 'eoa', name: 'EOA', tagType: 'custom' as const, ordinal: -1 } : undefined,
      config.features.validators.isEnabled && addressQuery.data?.has_validated_blocks ?
        { slug: 'validator', name: 'Validator', tagType: 'custom' as const, ordinal: 10 } :
        undefined,
      addressQuery.data?.implementations?.length ? { slug: 'proxy', name: 'Proxy', tagType: 'custom' as const, ordinal: -1 } : undefined,
      addressQuery.data?.token ? { slug: 'token', name: 'Token', tagType: 'custom' as const, ordinal: -1 } : undefined,
      isSafeAddress ? { slug: 'safe', name: 'Multisig: Safe', tagType: 'custom' as const, ordinal: -10 } : undefined,
      config.features.userOps.isEnabled && userOpsAccountQuery.data ?
        { slug: 'user_ops_acc', name: 'Smart contract wallet', tagType: 'custom' as const, ordinal: -10 } :
        undefined,
      config.features.mudFramework.isEnabled && mudTablesCountQuery.data ?
        { slug: 'mud', name: 'MUD World', tagType: 'custom' as const, ordinal: -10 } :
        undefined,
      ...formatUserTags(addressQuery.data),
      ...(addressMetadataQuery.data?.addresses?.[hash.toLowerCase()]?.tags || []),
    ].filter(Boolean).sort(sortEntityTags);
  }, [ addressMetadataQuery.data, addressQuery.data, hash, isSafeAddress, userOpsAccountQuery.data, mudTablesCountQuery.data ]);

  const titleContentAfter = (
    <EntityTags
      tags={ tags }
      isLoading={ isLoading || (config.features.addressMetadata.isEnabled && addressMetadataQuery.isPending) }
    />
  );

  const content = (addressQuery.isError || addressQuery.isDegradedData) ?
    null :
    <RoutedTabs tabs={ tabs } tabListProps={{ mt: 6 }} isLoading={ isTabsLoading }/>;

  const backLink = React.useMemo(() => {
    if (appProps.referrer && appProps.referrer.includes('/accounts')) {
      return {
        label: 'Back to top accounts list',
        url: appProps.referrer,
      };
    }

    if (appProps.referrer && appProps.referrer.includes('/mud-worlds')) {
      return {
        label: 'Back to MUD worlds list',
        url: appProps.referrer,
      };
    }

    return;
  }, [ appProps.referrer ]);

  const titleSecondRow = (
    <Flex alignItems="center" w="100%" columnGap={ 2 } rowGap={ 2 } flexWrap={{ base: 'wrap', lg: 'nowrap' }}>
      { addressQuery.data?.ens_domain_name && (
        <EnsEntity
          name={ addressQuery.data?.ens_domain_name }
          protocol={ !addressEnsDomainsQuery.isPending ? addressMainDomain?.protocol : null }
          fontFamily="heading"
          fontSize="lg"
          fontWeight={ 500 }
          mr={ 1 }
          maxW="300px"
        />
      ) }
      <AddressEntity
        address={{ ...addressQuery.data, hash, name: '', ens_domain_name: '', implementations: null }}
        isLoading={ isLoading }
        fontFamily="heading"
        fontSize="lg"
        fontWeight={ 500 }
        noLink
        isSafeAddress={ isSafeAddress }
        iconColor={ isSafeAddress ? safeIconColor : undefined }
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
      { !isLoading && addressQuery.data?.is_contract && addressQuery.data?.is_verified && config.UI.views.address.solidityscanEnabled &&
        <SolidityscanReport hash={ hash }/> }
      { !isLoading && addressEnsDomainsQuery.data && config.features.nameService.isEnabled &&
        <AddressEnsDomains query={ addressEnsDomainsQuery } addressHash={ hash } mainDomainName={ addressQuery.data?.ens_domain_name }/> }
      <NetworkExplorers type="address" pathParam={ hash }/>
    </Flex>
  );

  return (
    <>
      <TextAd mb={ 6 }/>
      <PageTitle
        title={ `${ addressQuery.data?.is_contract ? 'Contract' : 'Address' } details` }
        backLink={ backLink }
        contentAfter={ titleContentAfter }
        secondRow={ titleSecondRow }
        isLoading={ isLoading }
      />
      { !addressMetadataQuery.isPending &&
        <AddressMetadataAlert tags={ addressMetadataQuery.data?.addresses?.[hash.toLowerCase()]?.tags } mt="-4px" mb={ 6 }/> }
      { config.features.metasuites.isEnabled && <Box display="none" id="meta-suites__address" data-ready={ !isLoading }/> }
      <AddressDetails addressQuery={ addressQuery } scrollRef={ tabsScrollRef }/>
      { /* should stay before tabs to scroll up with pagination */ }
      <Box ref={ tabsScrollRef }></Box>
      { content }
    </>
  );
};

export default AddressPageContent;
