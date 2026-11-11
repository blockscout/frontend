// SPDX-License-Identifier: LicenseRef-Blockscout

import { Box } from '@chakra-ui/react';
import React from 'react';

import type { TabItemRegular } from 'src/toolkit/components/AdaptiveTabs/types';

import useApiQuery from 'src/api/hooks/useApiQuery';
import useSocketChannel from 'src/api/socket/useSocketChannel';
import useSocketMessage from 'src/api/socket/useSocketMessage';

import PageTitle from 'src/shell/page/title/PageTitle';

import useAddressCountersQuery from 'src/slices/address/hooks/useAddressCountersQuery';
import useAddressQuery from 'src/slices/address/hooks/useAddressQuery';
import useCheckAddressFormat from 'src/slices/address/hooks/useCheckAddressFormat';
import AddressPageTitleSecondRow from 'src/slices/address/pages/details/AddressPageTitleSecondRow';
import AddressBlocksValidated from 'src/slices/address/pages/details/blocks-validated/AddressBlocksValidated';
import AddressCoinBalance from 'src/slices/address/pages/details/coin-balance/AddressCoinBalance';
import { getAddressPageTags } from 'src/slices/address/pages/details/get-address-page-tags';
import AddressAlerts from 'src/slices/address/pages/details/info/AddressAlerts';
import AddressDetails from 'src/slices/address/pages/details/info/AddressDetails';
import AddressInternalTxs from 'src/slices/address/pages/details/internal-txs/AddressInternalTxs';
import AddressLogs from 'src/slices/address/pages/details/logs/AddressLogs';
import AddressTokenTransfers, { ADDRESS_TOKEN_TRANSFERS_TAB_IDS } from 'src/slices/address/pages/details/token-transfers/AddressTokenTransfers';
import AddressTokens from 'src/slices/address/pages/details/tokens/AddressTokens';
import AddressTxs, { ADDRESS_TXS_TAB_IDS } from 'src/slices/address/pages/details/txs/AddressTxs';
import { ADDRESS_TABS_COUNTERS } from 'src/slices/address/stubs/address';
import getCheckedSummedAddress from 'src/slices/address/utils/get-checked-summed-address';
import getChainValidationActionText from 'src/slices/chain/verification-type/utils/get-chain-validation-action-text';
import Contract from 'src/slices/contract/pages/details/Contract';
import { CONTRACT_TAB_IDS } from 'src/slices/contract/utils/tabs';

import Address3rdPartyWidgets from 'src/features/address-3rd-party-widgets/pages/address/Address3rdPartyWidgets';
import useAddress3rdPartyWidgets from 'src/features/address-3rd-party-widgets/pages/address/useAddress3rdPartyWidgets';
import MetadataTags from 'src/features/address-metadata/components/tag/MetadataTags';
import useAddressMetadataInfoQuery from 'src/features/address-metadata/hooks/useAddressMetadataInfoQuery';
import useAddressMetadataInitUpdate from 'src/features/address-metadata/hooks/useAddressMetadataInitUpdate';
import useAddressProfileApiQuery from 'src/features/address-profile-api/hooks/useAddressProfileApiQuery';
import TextAd from 'src/features/ads/text/components/TextAd';
import AddressDeposits from 'src/features/chain-variants/beacon-chain/pages/address/AddressDeposits';
import AddressWithdrawals from 'src/features/chain-variants/beacon-chain/pages/address/AddressWithdrawals';
import AddressEpochRewards from 'src/features/chain-variants/celo/pages/address/AddressEpochRewards';
import { useAddressClusters } from 'src/features/name-services/clusters/hooks/useAddressClusters';
import useCheckDomainNameParam from 'src/features/name-services/domains/hooks/useCheckDomainNameParam';
import useIsSafeAddress from 'src/features/safe/hooks/useIsSafeAddress';
import AddressAccountHistory from 'src/features/tx-interpretation/noves/pages/address/AddressAccountHistory';
import AddressUserOps from 'src/features/user-ops/pages/address/AddressUserOps';
import { USER_OPS_ACCOUNT } from 'src/features/user-ops/stubs';
import useFetchXStarScore from 'src/features/x-star-score/hooks/useFetchXStarScore';

import config from 'src/config';
import getQueryParamString from 'src/shared/router/get-query-param-string';
import useEtherscanRedirects from 'src/shared/router/useEtherscanRedirects';
import { useRouter } from 'src/shared/router/useRouter';
import SpriteIcon from 'src/sprite/SpriteIcon';

import RoutedTabs from 'src/toolkit/components/RoutedTabs/RoutedTabs';

const TOKEN_TABS = [ 'tokens_erc20', 'tokens_nfts', 'tokens_nfts_collection', 'tokens_nfts_list' ];

const txInterpretation = config.features.txInterpretation;
const addressProfileAPIFeature = config.features.addressProfileAPI;
const xScoreFeature = config.features.xStarScore;
const nameServicesFeature = config.features.nameServices;
const isEnsEnabled = nameServicesFeature.isEnabled && nameServicesFeature.ens.isEnabled;
const beaconChainFeature = config.features.beaconChain;

const AddressPageContent = () => {
  const router = useRouter();

  const hash = getQueryParamString(router.query.hash);

  const checkDomainName = useCheckDomainNameParam(hash);
  const checkAddressFormat = useCheckAddressFormat(hash);

  useEtherscanRedirects();

  const areQueriesEnabled = !checkDomainName && !checkAddressFormat;
  const addressQuery = useAddressQuery({ hash, isEnabled: areQueriesEnabled });

  const addressTabsCountersQuery = useApiQuery('core:address_tabs_counters', {
    pathParams: { hash },
    queryOptions: {
      enabled: areQueriesEnabled && Boolean(hash),
      placeholderData: ADDRESS_TABS_COUNTERS,
    },
  });

  const countersQuery = useAddressCountersQuery({
    hash,
    isDegradedData: addressQuery.isDegradedData,
  });

  const userOpsAccountQuery = useApiQuery('core:user_ops_account', {
    pathParams: { hash },
    queryOptions: {
      enabled: areQueriesEnabled && Boolean(hash) && config.features.userOps.isEnabled,
      placeholderData: USER_OPS_ACCOUNT,
    },
  });

  const addressesForMetadataQuery = React.useMemo(() => ([ hash ].filter(Boolean)), [ hash ]);
  const addressMetadataQuery = useAddressMetadataInfoQuery(addressesForMetadataQuery, areQueriesEnabled);
  const userPropfileApiQuery = useAddressProfileApiQuery(hash, addressProfileAPIFeature.isEnabled && areQueriesEnabled);

  const addressEnsDomainsQuery = useApiQuery('bens:addresses_lookup', {
    queryParams: {
      address: hash,
      protocols: isEnsEnabled ? nameServicesFeature.ens.protocols : undefined,
      resolved_to: true,
      owned_by: true,
      only_active: true,
      order: 'ASC',
    },
    queryOptions: {
      enabled: Boolean(hash) && isEnsEnabled,
    },
  });
  const addressMainDomain = !addressQuery.isPlaceholderData ?
    addressEnsDomainsQuery.data?.items.find((domain) => domain.name === addressQuery.data?.ens_domain_name) :
    undefined;

  const addressClustersQuery = useAddressClusters(hash, areQueriesEnabled);

  const addressType = addressQuery.data?.is_contract && addressQuery.data?.proxy_type !== 'eip7702' ? 'contract' : 'eoa';
  const address3rdPartyWidgets = useAddress3rdPartyWidgets(addressType, addressQuery.isPlaceholderData, areQueriesEnabled);

  const isLoading = addressQuery.isPlaceholderData;
  const isTabsLoading =
    isLoading ||
    addressTabsCountersQuery.isPlaceholderData ||
    (address3rdPartyWidgets.isEnabled && address3rdPartyWidgets.configQuery.isPlaceholderData) ||
    (config.features.userOps.isEnabled && userOpsAccountQuery.isPlaceholderData);

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

  useAddressMetadataInitUpdate({
    address: hash,
    isEnabled: !addressQuery.isPlaceholderData && !addressQuery.isDegradedData,
  });

  const isSafeAddress = useIsSafeAddress(!addressQuery.isPlaceholderData && addressQuery.data?.is_contract ? addressQuery.data.hash : undefined);

  const xStarQuery = useFetchXStarScore({ hash });

  const tabs: Array<TabItemRegular> = React.useMemo(() => {
    return [
      {
        id: 'index',
        title: 'Details',
        component: <AddressDetails addressQuery={ addressQuery } countersQuery={ countersQuery } isLoading={ isTabsLoading }/>,
      },
      addressQuery.data?.is_contract ? {
        id: 'contract',
        title: () => {
          const tabName = addressQuery.data.proxy_type === 'eip7702' ? 'Code' : 'Contract';

          if (addressQuery.data.is_verified) {
            return (
              <>
                <span>{ tabName }</span>
                <SpriteIcon name="status/success" boxSize="14px" color="green.500"/>
              </>
            );
          }

          return tabName;
        },
        component: (
          <Contract
            addressData={ addressQuery.data }
            isLoading={ isTabsLoading }
          />
        ),
        subTabs: CONTRACT_TAB_IDS,
      } : undefined,
      {
        id: 'txs',
        title: 'Transactions',
        count: addressTabsCountersQuery.data?.transactions_count,
        component: <AddressTxs shouldRender={ !isTabsLoading } isQueryEnabled={ areQueriesEnabled }/>,
        subTabs: ADDRESS_TXS_TAB_IDS,
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
      beaconChainFeature.isEnabled && !beaconChainFeature.withdrawalsOnly && addressTabsCountersQuery.data?.beacon_deposits_count ?
        {
          id: 'deposits',
          title: 'Deposits',
          count: addressTabsCountersQuery.data?.beacon_deposits_count,
          component: <AddressDeposits shouldRender={ !isTabsLoading } isQueryEnabled={ areQueriesEnabled }/>,
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
        subTabs: ADDRESS_TOKEN_TRANSFERS_TAB_IDS,
      },
      {
        id: 'tokens',
        title: 'Tokens',
        count: addressTabsCountersQuery.data?.token_balances_count,
        component: <AddressTokens shouldRender={ !isTabsLoading } isQueryEnabled={ areQueriesEnabled }/>,
        subTabs: TOKEN_TABS,
      },
      config.slices.internalTx.isEnabled ? {
        id: 'internal_txns',
        title: 'Internal txns',
        count: addressTabsCountersQuery.data?.internal_transactions_count,
        component: <AddressInternalTxs shouldRender={ !isTabsLoading } isQueryEnabled={ areQueriesEnabled }/>,
      } : undefined,
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
          title: `Blocks ${ getChainValidationActionText() }`,
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
      (address3rdPartyWidgets.isEnabled && address3rdPartyWidgets.items.length > 0) ? {
        id: 'widgets',
        title: 'Widgets',
        count: address3rdPartyWidgets.items.length,
        component: (
          <Address3rdPartyWidgets
            addressType={ addressType }
            isLoading={ addressQuery.isPlaceholderData }
            shouldRender={ !isTabsLoading }
            isQueryEnabled={ areQueriesEnabled }
            showAll
          />
        ),
      } : undefined,
    ].filter(Boolean);
  }, [
    addressQuery,
    countersQuery,
    addressTabsCountersQuery.data,
    userOpsAccountQuery.data,
    isTabsLoading,
    areQueriesEnabled,
    address3rdPartyWidgets,
    addressType,
  ]);

  const usernameApiTag = userPropfileApiQuery.data?.user_profile?.username;
  const metadataTags = addressMetadataQuery.data?.addresses?.[hash.toLowerCase()]?.tags;
  const hasUserOpsAccount = Boolean(userOpsAccountQuery.data);
  const xStarLevel = xStarQuery.data?.data.level;

  const tags = React.useMemo(() => getAddressPageTags({
    addressData: addressQuery.data,
    isSafeAddress,
    hasUserOpsAccount,
    usernameApiTag,
    metadataTags,
    xStarLevel,
  }), [ addressQuery.data, isSafeAddress, hasUserOpsAccount, usernameApiTag, metadataTags, xStarLevel ]);

  const isTagsLoading =
    isLoading ||
    (config.features.userOps.isEnabled && userOpsAccountQuery.isPlaceholderData) ||
    (config.features.addressMetadata.isEnabled && addressMetadataQuery.isPending) ||
    (addressProfileAPIFeature.isEnabled && userPropfileApiQuery.isPending) ||
    (xScoreFeature.isEnabled && xStarQuery.isPlaceholderData);

  const titleContentAfter = (
    <MetadataTags
      tags={ tags }
      addressHash={ addressQuery.data?.hash }
      isLoading={ isTagsLoading }
    />
  );

  // API always returns hash in check-summed format except for addresses that are not in the database
  // In this case it returns 404 with empty payload, so we calculate check-summed hash on the client
  const checkSummedHash = React.useMemo(() => {
    if (isLoading) {
      return getCheckedSummedAddress(hash);
    }

    return addressQuery.data?.hash ?? getCheckedSummedAddress(hash);
  }, [ hash, addressQuery.data?.hash, isLoading ]);

  const titleSecondRow = (
    <AddressPageTitleSecondRow
      hash={ hash }
      checkSummedHash={ checkSummedHash }
      addressQuery={ addressQuery }
      addressEnsDomainsQuery={ addressEnsDomainsQuery }
      addressMainDomain={ addressMainDomain }
      addressClustersQuery={ addressClustersQuery }
      isSafeAddress={ isSafeAddress }
      isLoading={ isLoading }
    />
  );

  return (
    <>
      <TextAd mb={ 6 }/>
      <PageTitle
        title={ `${ addressType === 'contract' ? 'Contract' : 'Address' } details` }
        contentAfter={ titleContentAfter }
        secondRow={ titleSecondRow }
        isLoading={ isLoading }
      />
      <AddressAlerts
        tags={ metadataTags }
        isScamAddress={ addressQuery.data?.is_scam }
      />
      { config.features.metasuites.isEnabled && <Box display="none" id="meta-suites__address" data-ready={ !isLoading }/> }
      <RoutedTabs tabs={ tabs } isLoading={ isTabsLoading }/>
    </>
  );
};

export default AddressPageContent;
