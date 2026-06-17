// SPDX-License-Identifier: LicenseRef-Blockscout

import { Box, Flex, HStack } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React from 'react';

import type { MetadataTag } from 'src/features/address-metadata/components/tag/types';
import type { TabItemRegular } from 'src/toolkit/components/AdaptiveTabs/types';

import useApiQuery from 'src/api/hooks/useApiQuery';
import useSocketChannel from 'src/api/socket/useSocketChannel';
import useSocketMessage from 'src/api/socket/useSocketMessage';

import ActionsMenu from 'src/shell/page/actions-menu/ActionsMenu';
import PageTitle from 'src/shell/page/title/PageTitle';

import AddressEntity from 'src/slices/address/components/entity/AddressEntity';
import useAddressCountersQuery from 'src/slices/address/hooks/useAddressCountersQuery';
import useAddressQuery from 'src/slices/address/hooks/useAddressQuery';
import useCheckAddressFormat from 'src/slices/address/hooks/useCheckAddressFormat';
import AddressBlocksValidated from 'src/slices/address/pages/details/blocks-validated/AddressBlocksValidated';
import AddressCoinBalance from 'src/slices/address/pages/details/coin-balance/AddressCoinBalance';
import AddressAlerts from 'src/slices/address/pages/details/info/AddressAlerts';
import AddressDetails from 'src/slices/address/pages/details/info/AddressDetails';
import AddressQrCode from 'src/slices/address/pages/details/info/AddressQrCode';
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

import AddressFavoriteButton from 'src/features/account/pages/address/AddressFavoriteButton';
import Address3rdPartyWidgets from 'src/features/address-3rd-party-widgets/pages/address/Address3rdPartyWidgets';
import useAddress3rdPartyWidgets from 'src/features/address-3rd-party-widgets/pages/address/useAddress3rdPartyWidgets';
import formatAccountTags from 'src/features/address-metadata/components/tag/format-account-tags';
import MetadataTags from 'src/features/address-metadata/components/tag/MetadataTags';
import sortMetadataTags from 'src/features/address-metadata/components/tag/sort';
import useAddressMetadataInfoQuery from 'src/features/address-metadata/hooks/useAddressMetadataInfoQuery';
import useAddressMetadataInitUpdate from 'src/features/address-metadata/hooks/useAddressMetadataInitUpdate';
import useAddressProfileApiQuery from 'src/features/address-profile-api/hooks/useAddressProfileApiQuery';
import TextAd from 'src/features/ads/text/components/TextAd';
import AlternativeExplorers from 'src/features/alternative-explorers/components/AlternativeExplorers';
import AddressDeposits from 'src/features/chain-variants/beacon-chain/pages/address/AddressDeposits';
import AddressWithdrawals from 'src/features/chain-variants/beacon-chain/pages/address/AddressWithdrawals';
import AddressEpochRewards from 'src/features/chain-variants/celo/pages/address/AddressEpochRewards';
import AddressMud from 'src/features/chain-variants/mud/pages/address/AddressMud';
import AddressMultichainInfoButton from 'src/features/multichain-button/pages/address/AddressMultichainInfoButton';
import { useAddressClusters } from 'src/features/name-services/clusters/hooks/useAddressClusters';
import AddressClusters from 'src/features/name-services/clusters/pages/address/AddressClusters';
import EnsEntity from 'src/features/name-services/domains/components/EnsEntity';
import useCheckDomainNameParam from 'src/features/name-services/domains/hooks/useCheckDomainNameParam';
import AddressEnsDomains from 'src/features/name-services/domains/pages/address/AddressEnsDomains';
import useIsSafeAddress from 'src/features/safe/hooks/useIsSafeAddress';
import SolidityscanReport from 'src/features/solidity-scan/components/SolidityscanReport';
import AddressAccountHistory from 'src/features/tx-interpretation/noves/pages/address/AddressAccountHistory';
import AddressUserOps from 'src/features/user-ops/pages/address/AddressUserOps';
import { USER_OPS_ACCOUNT } from 'src/features/user-ops/stubs';
import TokenAddToWallet from 'src/features/web3-wallet/components/TokenAddToWallet';
import useFetchXStarScore from 'src/features/x-star-score/hooks/useFetchXStarScore';

import config from 'src/config';
import getQueryParamString from 'src/shared/router/get-query-param-string';
import useEtherscanRedirects from 'src/shared/router/useEtherscanRedirects';
import SpriteIcon from 'src/sprite/SpriteIcon';

import RoutedTabs from 'src/toolkit/components/RoutedTabs/RoutedTabs';

const TOKEN_TABS = [ 'tokens_erc20', 'tokens_nfts', 'tokens_nfts_collection', 'tokens_nfts_list' ];
const PREDEFINED_TAG_PRIORITY = 100;
const FHE_TOOLTIP_DESCRIPTION = 'This contract uses Fully Homomorphic Encryption (FHE) to encrypt on-chain data. ' +
    'Inputs and most outputs are intentionally hidden, while computations are verified on-chain.';

const txInterpretation = config.features.txInterpretation;
const addressProfileAPIFeature = config.features.addressProfileAPI;
const xScoreFeature = config.features.xStarScore;
const nameServicesFeature = config.features.nameServices;
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
    isLoading: addressQuery.isPlaceholderData,
    isDegradedData: addressQuery.isDegradedData,
  });

  const userOpsAccountQuery = useApiQuery('core:user_ops_account', {
    pathParams: { hash },
    queryOptions: {
      enabled: areQueriesEnabled && Boolean(hash) && config.features.userOps.isEnabled,
      placeholderData: USER_OPS_ACCOUNT,
    },
  });

  const mudTablesCountQuery = useApiQuery('core:mud_tables_count', {
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
    queryParams: {
      address: hash,
      protocols: nameServicesFeature.isEnabled && nameServicesFeature.ens.isEnabled ? nameServicesFeature.ens.protocols : undefined,
      resolved_to: true,
      owned_by: true,
      only_active: true,
      order: 'ASC',
    },
    queryOptions: {
      enabled: Boolean(hash) && nameServicesFeature.isEnabled && nameServicesFeature.ens.isEnabled,
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
            hasMudTab={ Boolean(config.features.mudFramework.isEnabled && mudTablesCountQuery.data && mudTablesCountQuery.data > 0) }
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
    mudTablesCountQuery.data,
    address3rdPartyWidgets,
    addressType,
  ]);

  const usernameApiTag = userPropfileApiQuery.data?.user_profile?.username;

  const tags: Array<MetadataTag> = React.useMemo(() => {
    return [
      ...(addressQuery.data?.public_tags?.map((tag) => {
        const isFhe = tag.label.toLowerCase() === 'fhe' || tag.display_name.toLowerCase() === 'fhe';
        return {
          slug: tag.label,
          name: tag.display_name,
          tagType: 'custom' as const,
          ordinal: -1,
          meta: isFhe ? {
            tooltipDescription: FHE_TOOLTIP_DESCRIPTION,
          } : undefined,
        };
      }) || []),
      addressQuery.data?.celo?.account ? {
        slug: 'celo-account',
        name: 'Celo account',
        tagType: 'custom' as const,
        ordinal: PREDEFINED_TAG_PRIORITY,
        meta: {
          bgColor: 'yellow.200',
          textColor: 'black',
        },
      } : undefined,
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
      ...formatAccountTags(addressQuery.data),
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
    ].filter(Boolean).sort(sortMetadataTags);
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
    <MetadataTags
      tags={ tags }
      addressHash={ addressQuery.data?.hash }
      isLoading={
        isLoading ||
        (config.features.userOps.isEnabled && userOpsAccountQuery.isPlaceholderData) ||
        (config.features.addressMetadata.isEnabled && addressMetadataQuery.isPending) ||
        (addressProfileAPIFeature.isEnabled && userPropfileApiQuery.isPending) ||
        (xScoreFeature.isEnabled && xStarQuery.isPlaceholderData)
      }
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

  const protocolDapp = React.useMemo(() => {
    return {
      url: addressMainDomain?.protocol_dapp_url,
      logo: addressMainDomain?.protocol_dapp_logo,
    };
  }, [ addressMainDomain?.protocol_dapp_url, addressMainDomain?.protocol_dapp_logo ]);

  const titleSecondRow = (
    <Flex alignItems="center" w="100%" columnGap={ 2 } rowGap={ 2 } flexWrap={{ base: 'wrap', lg: 'nowrap' }}>
      { addressQuery.data?.ens_domain_name && (
        <EnsEntity
          domain={ addressQuery.data?.ens_domain_name }
          protocol={ !addressEnsDomainsQuery.isPending ? addressMainDomain?.protocol : null }
          protocolDapp={ !addressEnsDomainsQuery.isPending ? protocolDapp : undefined }
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
          implementations: [],
        }}
        isLoading={ isLoading }
        variant="subheading"
        noLink
        isSafeAddress={ isSafeAddress }
        icon={{ color: isSafeAddress ? { _light: 'black', _dark: 'white' } : undefined }}
      />
      { !isLoading && addressQuery.data?.is_contract && addressQuery.data.token &&
        <TokenAddToWallet token={ addressQuery.data.token } variant="button"/> }
      { !isLoading && !addressQuery.data?.is_contract && config.features.account.isEnabled && (
        <AddressFavoriteButton hash={ hash } watchListId={ addressQuery.data?.watchlist_address_id }/>
      ) }
      <AddressQrCode hash={ addressQuery.data?.filecoin?.robust ?? checkSummedHash } isLoading={ isLoading }/>
      <ActionsMenu isLoading={ isLoading }/>
      <HStack ml="auto" gap={ 2 }/>
      <AddressMultichainInfoButton loading={ isLoading } addressData={ addressQuery.data }/>
      { !isLoading && addressQuery.data?.is_contract && addressQuery.data?.is_verified && config.slices.contract.solidityscanEnabled &&
        <SolidityscanReport hash={ hash }/> }
      { !isLoading && nameServicesFeature.isEnabled && nameServicesFeature.ens.isEnabled &&
        <AddressEnsDomains query={ addressEnsDomainsQuery } addressHash={ hash } mainDomainName={ addressQuery.data?.ens_domain_name }/> }
      { !isLoading && nameServicesFeature.isEnabled && nameServicesFeature.clusters.isEnabled &&
        <AddressClusters query={ addressClustersQuery } addressHash={ hash }/> }
      <AlternativeExplorers type="address" pathParam={ hash }/>
    </Flex>
  );

  return (
    <>
      <TextAd mb={ 6 }/>
      <PageTitle
        title={ `${ addressQuery.data?.is_contract && addressQuery.data?.proxy_type !== 'eip7702' ? 'Contract' : 'Address' } details` }
        contentAfter={ titleContentAfter }
        secondRow={ titleSecondRow }
        isLoading={ isLoading }
      />
      { !addressMetadataQuery.isPending &&
        <AddressAlerts tags={ addressMetadataQuery.data?.addresses?.[hash.toLowerCase()]?.tags }/> }
      { config.features.metasuites.isEnabled && <Box display="none" id="meta-suites__address" data-ready={ !isLoading }/> }
      <RoutedTabs tabs={ tabs } isLoading={ isTabsLoading }/>
    </>
  );
};

export default AddressPageContent;
