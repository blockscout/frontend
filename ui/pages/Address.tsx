import { Box, Flex, HStack } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React from 'react';

import type { TabItemRegular } from 'toolkit/components/AdaptiveTabs/types';
import type { EntityTag } from 'ui/shared/EntityTags/types';

import config from 'configs/app';
import getCheckedSummedAddress from 'lib/address/getCheckedSummedAddress';
import useAddressMetadataInfoQuery from 'lib/address/useAddressMetadataInfoQuery';
import useApiQuery from 'lib/api/useApiQuery';
import { useAppContext } from 'lib/contexts/app';
import useAddressProfileApiQuery from 'lib/hooks/useAddressProfileApiQuery';
import useIsSafeAddress from 'lib/hooks/useIsSafeAddress';
import getNetworkValidationActionText from 'lib/networks/getNetworkValidationActionText';
import getQueryParamString from 'lib/router/getQueryParamString';
import useSocketChannel from 'lib/socket/useSocketChannel';
import useSocketMessage from 'lib/socket/useSocketMessage';
import useFetchXStarScore from 'lib/xStarScore/useFetchXStarScore';
import { ADDRESS_TABS_COUNTERS } from 'stubs/address';
import { USER_OPS_ACCOUNT } from 'stubs/userOps';
import RoutedTabs from 'toolkit/components/RoutedTabs/RoutedTabs';
import AddressAccountHistory from 'ui/address/AddressAccountHistory';
import AddressBlocksValidated from 'ui/address/AddressBlocksValidated';
import AddressCoinBalance from 'ui/address/AddressCoinBalance';
import AddressContract from 'ui/address/AddressContract';
import AddressDetails from 'ui/address/AddressDetails';
import AddressEpochRewards from 'ui/address/AddressEpochRewards';
import AddressInternalTxs from 'ui/address/AddressInternalTxs';
import AddressLogs from 'ui/address/AddressLogs';
import AddressMud from 'ui/address/AddressMud';
import AddressTokens from 'ui/address/AddressTokens';
import AddressTokenTransfers from 'ui/address/AddressTokenTransfers';
import AddressTxs from 'ui/address/AddressTxs';
import AddressUserOps from 'ui/address/AddressUserOps';
import AddressWithdrawals from 'ui/address/AddressWithdrawals';
import useContractTabs from 'ui/address/contract/useContractTabs';
import { CONTRACT_TAB_IDS } from 'ui/address/contract/utils';
import AddressFavoriteButton from 'ui/address/details/AddressFavoriteButton';
import AddressMetadataAlert from 'ui/address/details/AddressMetadataAlert';
import AddressQrCode from 'ui/address/details/AddressQrCode';
import AddressEnsDomains from 'ui/address/ensDomains/AddressEnsDomains';
import SolidityscanReport from 'ui/address/SolidityscanReport';
import useAddressQuery from 'ui/address/utils/useAddressQuery';
import useCheckAddressFormat from 'ui/address/utils/useCheckAddressFormat';
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

const TOKEN_TABS = [ 'tokens_erc20', 'tokens_nfts', 'tokens_nfts_collection', 'tokens_nfts_list' ];
const PREDEFINED_TAG_PRIORITY = 100;

const txInterpretation = config.features.txInterpretation;
const addressProfileAPIFeature = config.features.addressProfileAPI;
const xScoreFeature = config.features.xStarScore;

const AddressPageContent = () => {
  const router = useRouter();
  const appProps = useAppContext();

  const hash = getQueryParamString(router.query.hash);

  const checkDomainName = useCheckDomainNameParam(hash);
  const checkAddressFormat = useCheckAddressFormat(hash);
  const areQueriesEnabled = !checkDomainName && !checkAddressFormat;
  const addressQuery = useAddressQuery({ hash, isEnabled: areQueriesEnabled });

  const addressTabsCountersQuery = useApiQuery('general:address_tabs_counters', {
    pathParams: { hash },
    queryOptions: {
      enabled: areQueriesEnabled && Boolean(hash),
      placeholderData: ADDRESS_TABS_COUNTERS,
    },
  });

  const userOpsAccountQuery = useApiQuery('general:user_ops_account', {
    pathParams: { hash },
    queryOptions: {
      enabled: areQueriesEnabled && Boolean(hash) && config.features.userOps.isEnabled,
      placeholderData: USER_OPS_ACCOUNT,
    },
  });

  const mudTablesCountQuery = useApiQuery('general:mud_tables_count', {
    pathParams: { hash },
    queryOptions: {
      enabled: config.features.mudFramework.isEnabled && areQueriesEnabled && Boolean(hash),
      placeholderData: 10,
    },
  });

  const addressesForMetadataQuery = React.useMemo(() => ([ hash ].filter(Boolean)), [ hash ]);
  const addressMetadataQuery = useAddressMetadataInfoQuery(addressesForMetadataQuery, areQueriesEnabled);
  const userPropfileApiQuery = useAddressProfileApiQuery(hash, addressProfileAPIFeature.isEnabled && areQueriesEnabled);

  const addressEnsDomainsQuery = useApiQuery('bens:addresses_lookup', {
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

  const xStarQuery = useFetchXStarScore({ hash });

  const contractTabs = useContractTabs(
    addressQuery.data,
    config.features.mudFramework.isEnabled ? (mudTablesCountQuery.isPlaceholderData || addressQuery.isPlaceholderData) : addressQuery.isPlaceholderData,
    Boolean(config.features.mudFramework.isEnabled && mudTablesCountQuery.data && mudTablesCountQuery.data > 0),
  );

  const tabs: Array<TabItemRegular> = React.useMemo(() => {
    return [
      {
        id: 'index',
        title: 'Details',
        component: <AddressDetails addressQuery={ addressQuery } isLoading={ isTabsLoading }/>,
      },
      addressQuery.data?.is_contract ? {
        id: 'contract',
        title: () => {
          const tabName = addressQuery.data.proxy_type === 'eip7702' ? 'Code' : 'Contract';

          if (addressQuery.data.is_verified) {
            return (
              <>
                <span>{ tabName }</span>
                <IconSvg name="status/success" boxSize="14px" color="green.500"/>
              </>
            );
          }

          return tabName;
        },
        component: (
          <AddressContract
            tabs={ contractTabs.tabs }
            shouldRender={ !isTabsLoading }
            isLoading={ contractTabs.isLoading }
          />
        ),
        subTabs: CONTRACT_TAB_IDS,
      } : undefined,
      config.features.mudFramework.isEnabled && mudTablesCountQuery.data && mudTablesCountQuery.data > 0 && {
        id: 'mud',
        title: 'MUD',
        count: mudTablesCountQuery.data,
        component: <AddressMud shouldRender={ !isTabsLoading } isQueryEnabled={ areQueriesEnabled }/>,
      },
      {
        id: 'txs',
        title: 'Transactions',
        count: addressTabsCountersQuery.data?.transactions_count,
        component: <AddressTxs shouldRender={ !isTabsLoading } isQueryEnabled={ areQueriesEnabled }/>,
      },
      txInterpretation.isEnabled && txInterpretation.provider === 'noves' ?
        {
          id: 'account_history',
          title: 'Account history',
          component: <AddressAccountHistory shouldRender={ !isTabsLoading } isQueryEnabled={ areQueriesEnabled }/>,
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
          component: <AddressWithdrawals shouldRender={ !isTabsLoading } isQueryEnabled={ areQueriesEnabled }/>,
        } :
        undefined,
      {
        id: 'token_transfers',
        title: 'Token transfers',
        count: addressTabsCountersQuery.data?.token_transfers_count,
        component: <AddressTokenTransfers shouldRender={ !isTabsLoading } isQueryEnabled={ areQueriesEnabled }/>,
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
        count: addressTabsCountersQuery.data?.internal_transactions_count,
        component: <AddressInternalTxs shouldRender={ !isTabsLoading } isQueryEnabled={ areQueriesEnabled }/>,
      },
      addressTabsCountersQuery.data?.celo_election_rewards_count ? {
        id: 'epoch_rewards',
        title: 'Epoch rewards',
        count: addressTabsCountersQuery.data?.celo_election_rewards_count,
        component: <AddressEpochRewards shouldRender={ !isTabsLoading } isQueryEnabled={ areQueriesEnabled }/>,
      } : undefined,
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
          component: <AddressBlocksValidated shouldRender={ !isTabsLoading } isQueryEnabled={ areQueriesEnabled }/>,
        } :
        undefined,
      addressTabsCountersQuery.data?.logs_count ?
        {
          id: 'logs',
          title: 'Logs',
          count: addressTabsCountersQuery.data?.logs_count,
          component: <AddressLogs shouldRender={ !isTabsLoading } isQueryEnabled={ areQueriesEnabled }/>,
        } :
        undefined,
    ].filter(Boolean);
  }, [
    addressQuery,
    contractTabs,
    addressTabsCountersQuery.data,
    userOpsAccountQuery.data,
    isTabsLoading,
    areQueriesEnabled,
    mudTablesCountQuery.data,
  ]);

  const usernameApiTag = userPropfileApiQuery.data?.user_profile?.username;

  const tags: Array<EntityTag> = React.useMemo(() => {
    return [
      ...(addressQuery.data?.public_tags?.map((tag) => ({ slug: tag.label, name: tag.display_name, tagType: 'custom' as const, ordinal: -1 })) || []),
      !addressQuery.data?.is_contract ? { slug: 'eoa', name: 'EOA', tagType: 'custom' as const, ordinal: PREDEFINED_TAG_PRIORITY } : undefined,
      config.features.validators.isEnabled && addressQuery.data?.has_validated_blocks ?
        { slug: 'validator', name: 'Validator', tagType: 'custom' as const, ordinal: PREDEFINED_TAG_PRIORITY } :
        undefined,
      addressQuery.data?.implementations?.length && addressQuery.data?.proxy_type !== 'eip7702' ?
        { slug: 'proxy', name: 'Proxy', tagType: 'custom' as const, ordinal: PREDEFINED_TAG_PRIORITY } :
        undefined,
      addressQuery.data?.implementations?.length && addressQuery.data?.proxy_type === 'eip7702' ?
        { slug: 'eip7702', name: 'EOA+code', tagType: 'custom' as const, ordinal: PREDEFINED_TAG_PRIORITY } :
        undefined,
      addressQuery.data?.token ? { slug: 'token', name: 'Token', tagType: 'custom' as const, ordinal: PREDEFINED_TAG_PRIORITY } : undefined,
      isSafeAddress ? { slug: 'safe', name: 'Multisig: Safe', tagType: 'custom' as const, ordinal: -10 } : undefined,
      addressProfileAPIFeature.isEnabled && usernameApiTag ? {
        slug: 'username_api',
        name: usernameApiTag,
        tagType: 'custom' as const,
        ordinal: 11,
        meta: {
          tagIcon: addressProfileAPIFeature.tagIcon,
          bgColor: addressProfileAPIFeature.tagBgColor,
          textColor: addressProfileAPIFeature.tagTextColor,
          tagUrl: addressProfileAPIFeature.tagLinkTemplate ? addressProfileAPIFeature.tagLinkTemplate.replace('{username}', usernameApiTag) : undefined,
        },
      } : undefined,
      config.features.userOps.isEnabled && userOpsAccountQuery.data ?
        { slug: 'user_ops_acc', name: 'Smart contract wallet', tagType: 'custom' as const, ordinal: PREDEFINED_TAG_PRIORITY } :
        undefined,
      config.features.mudFramework.isEnabled && mudTablesCountQuery.data ?
        { slug: 'mud', name: 'MUD World', tagType: 'custom' as const, ordinal: PREDEFINED_TAG_PRIORITY } :
        undefined,
      ...formatUserTags(addressQuery.data),
      ...(addressMetadataQuery.data?.addresses?.[hash.toLowerCase()]?.tags.filter(tag => tag.tagType !== 'note') || []),
      !addressQuery.data?.is_contract && xScoreFeature.isEnabled && xStarQuery.data?.data.level ?
        {
          slug: 'xstar',
          name: `XHS ${ xStarQuery.data.data.level } level`,
          tagType: 'custom' as const,
          ordinal: 12,
          meta: {
            tooltipTitle: 'XStar humanity levels',
            tooltipDescription:
              'XStar looks for off-chain information about an address and interpret it as a XHS score. Different score means different humanity levels.',
            tooltipUrl: xScoreFeature.url,
          },
        } :
        undefined,
    ].filter(Boolean).sort(sortEntityTags);
  }, [
    addressMetadataQuery.data,
    addressQuery.data,
    hash,
    isSafeAddress,
    userOpsAccountQuery.data,
    mudTablesCountQuery.data,
    usernameApiTag,
    xStarQuery.data?.data,
  ]);

  const titleContentAfter = (
    <EntityTags
      tags={ tags }
      isLoading={
        isLoading ||
        (config.features.userOps.isEnabled && userOpsAccountQuery.isPlaceholderData) ||
        (config.features.addressMetadata.isEnabled && addressMetadataQuery.isPending) ||
        (addressProfileAPIFeature.isEnabled && userPropfileApiQuery.isPending) ||
        (xScoreFeature.isEnabled && xStarQuery.isPlaceholderData)
      }
    />
  );

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

  // API always returns hash in check-summed format except for addresses that are not in the database
  // In this case it returns 404 with empty payload, so we calculate check-summed hash on the client
  const checkSummedHash = React.useMemo(() => {
    if (isLoading) {
      return getCheckedSummedAddress(hash);
    }

    return addressQuery.data?.hash ?? getCheckedSummedAddress(hash);
  }, [ hash, addressQuery.data?.hash, isLoading ]);

  const titleSecondRow = (
    <Flex alignItems="center" w="100%" columnGap={ 2 } rowGap={ 2 } flexWrap={{ base: 'wrap', lg: 'nowrap' }}>
      { addressQuery.data?.ens_domain_name && (
        <EnsEntity
          domain={ addressQuery.data?.ens_domain_name }
          protocol={ !addressEnsDomainsQuery.isPending ? addressMainDomain?.protocol : null }
          variant="subheading"
          mr={ 1 }
          maxW="300px"
        />
      ) }
      <AddressEntity
        address={{
          ...addressQuery.data,
          hash: checkSummedHash,
          name: '',
          ens_domain_name: '',
          implementations: null,
        }}
        isLoading={ isLoading }
        variant="subheading"
        noLink
        isSafeAddress={ isSafeAddress }
        icon={{ color: isSafeAddress ? { _light: 'black', _dark: 'white' } : undefined }}
      />
      { !isLoading && addressQuery.data?.is_contract && addressQuery.data.token &&
        <AddressAddToWallet token={ addressQuery.data.token } variant="button"/> }
      { !isLoading && !addressQuery.data?.is_contract && config.features.account.isEnabled && (
        <AddressFavoriteButton hash={ hash } watchListId={ addressQuery.data?.watchlist_address_id }/>
      ) }
      <AddressQrCode hash={ addressQuery.data?.filecoin?.robust ?? checkSummedHash } isLoading={ isLoading }/>
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
        title={ `${ addressQuery.data?.is_contract && addressQuery.data?.proxy_type !== 'eip7702' ? 'Contract' : 'Address' } details` }
        backLink={ backLink }
        contentAfter={ titleContentAfter }
        secondRow={ titleSecondRow }
        isLoading={ isLoading }
      />
      { !addressMetadataQuery.isPending &&
        <AddressMetadataAlert tags={ addressMetadataQuery.data?.addresses?.[hash.toLowerCase()]?.tags } mt="-4px" mb={ 6 }/> }
      { config.features.metasuites.isEnabled && <Box display="none" id="meta-suites__address" data-ready={ !isLoading }/> }
      <RoutedTabs tabs={ tabs } isLoading={ isTabsLoading }/>
    </>
  );
};

export default AddressPageContent;
