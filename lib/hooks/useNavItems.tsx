import { useRouter } from 'next/router';
import React from 'react';
import { useTranslation } from 'react-i18next';

import type { NavItemInternal, NavItem, NavGroupItem } from 'types/client/navigation';

import config from 'configs/app';
import UserAvatar from 'ui/shared/UserAvatar';

interface ReturnType {
  mainNavItems: Array<NavItem | NavGroupItem>;
  accountNavItems: Array<NavItem>;
  profileItem: NavItem;
}

export function isGroupItem(item: NavItem | NavGroupItem): item is NavGroupItem {
  return 'subItems' in item;
}

export function isInternalItem(item: NavItem): item is NavItemInternal {
  return 'nextRoute' in item;
}

export default function useNavItems(): ReturnType {
  const { t } = useTranslation();
  const router = useRouter();
  const pathname = router.pathname;

  return React.useMemo(() => {
    let blockchainNavItems: Array<NavItem> | Array<Array<NavItem>> = [];

    const topAccounts: NavItem | null = !config.UI.views.address.hiddenViews?.top_accounts ? {
      text: t('navbar.top_accounts'),
      nextRoute: { pathname: '/accounts' as const },
      icon: 'top-accounts',
      isActive: pathname === '/accounts',
    } : null;
    const blocks: NavItem | null = {
      text: t('navbar.blocks'),
      nextRoute: { pathname: '/blocks' as const },
      icon: 'block',
      isActive: pathname === '/blocks' || pathname === '/block/[height_or_hash]',
    };
    const txs: NavItem | null = {
      text: t('navbar.transactions'),
      nextRoute: { pathname: '/txs' as const },
      icon: 'transactions',
      isActive: pathname === '/txs' || pathname === '/tx/[hash]',
    };
    const userOps: NavItem | null = config.features.userOps.isEnabled ? {
      text: t('navbar.user_operations'),
      nextRoute: { pathname: '/ops' as const },
      icon: 'user_op',
      isActive: pathname === '/ops' || pathname === '/op/[hash]',
    } : null;
    const verifiedContracts: NavItem | null =
    {
      text: t('navbar.verified_contracts'),
      nextRoute: { pathname: '/verified-contracts' as const },
      icon: 'verified',
      isActive: pathname === '/verified-contracts',
    };
    const ensLookup = config.features.nameService.isEnabled ? {
      text: t('navbar.name_services_lookup'),
      nextRoute: { pathname: '/name-domains' as const },
      icon: 'ENS',
      isActive: pathname === '/name-domains' || pathname === '/name-domains/[name]',
    } : null;
    const validators = config.features.validators.isEnabled ? {
      text: t('navbar.top_validators'),
      nextRoute: { pathname: '/validators' as const },
      icon: 'validator',
      isActive: pathname === '/validators',
    } : null;
    const rollupDeposits = {
      text: t('navbar.deposits'),
      nextRoute: { pathname: '/deposits' as const },
      icon: 'arrows/south-east',
      isActive: pathname === '/deposits',
    };
    const rollupWithdrawals = {
      text: t('navbar.withdrawals'),
      nextRoute: { pathname: '/withdrawals' as const },
      icon: 'arrows/north-east',
      isActive: pathname === '/withdrawals',
    };
    const rollupTxnBatches = {
      text: t('navbar.txn_batches'),
      nextRoute: { pathname: '/batches' as const },
      icon: 'txn_batches',
      isActive: pathname === '/batches',
    };
    const rollupOutputRoots = {
      text: t('navbar.output_roots'),
      nextRoute: { pathname: '/output-roots' as const },
      icon: 'output_roots',
      isActive: pathname === '/output-roots',
    };
    const rollupDisputeGames = config.features.faultProofSystem.isEnabled ? {
      text: t('navbar.dispute_games'),
      nextRoute: { pathname: '/dispute-games' as const },
      icon: 'games',
      isActive: pathname === '/dispute-games',
    } : null;

    const rollupFeature = config.features.rollup;

    if (rollupFeature.isEnabled && (rollupFeature.type === 'optimistic' || rollupFeature.type === 'arbitrum' || rollupFeature.type === 'zkEvm')) {
      blockchainNavItems = [
        [
          txs,
          rollupDeposits,
          rollupWithdrawals,
        ],
        [
          blocks,
          rollupTxnBatches,
          rollupDisputeGames,
          rollupFeature.type === 'optimistic' ? rollupOutputRoots : undefined,
        ].filter(Boolean),
        [
          userOps,
          topAccounts,
          validators,
          verifiedContracts,
          ensLookup,
        ].filter(Boolean),
      ];
    } else if (rollupFeature.isEnabled && rollupFeature.type === 'shibarium') {
      blockchainNavItems = [
        [
          txs,
          rollupDeposits,
          rollupWithdrawals,
        ],
        [
          blocks,
          userOps,
          topAccounts,
          verifiedContracts,
          ensLookup,
        ].filter(Boolean),
      ];
    } else if (rollupFeature.isEnabled && rollupFeature.type === 'zkSync') {
      blockchainNavItems = [
        [
          txs,
          userOps,
          blocks,
          rollupTxnBatches,
        ].filter(Boolean),
        [
          topAccounts,
          validators,
          verifiedContracts,
          ensLookup,
        ].filter(Boolean),
      ];
    } else {
      blockchainNavItems = [
        txs,
        userOps,
        blocks,
        topAccounts,
        validators,
        verifiedContracts,
        ensLookup,
        config.features.beaconChain.isEnabled && {
          text: t('navbar.withdrawals'),
          nextRoute: { pathname: '/withdrawals' as const },
          icon: 'arrows/north-east',
          isActive: pathname === '/withdrawals',
        },
      ].filter(Boolean);
    }

    const apiNavItems: Array<NavItem> = [
      config.features.restApiDocs.isEnabled ? {
        text: t('navbar.rest_api'),
        nextRoute: { pathname: '/api-docs' as const },
        icon: 'restAPI',
        isActive: pathname === '/api-docs',
      } : null,
      config.features.graphqlApiDocs.isEnabled ? {
        text: t('navbar.graphql'),
        nextRoute: { pathname: '/graphiql' as const },
        icon: 'graphQL',
        isActive: pathname === '/graphiql',
      } : null,
      !config.UI.navigation.hiddenLinks?.rpc_api && {
        text: t('navbar.rpc_api'),
        icon: 'RPC',
        url: 'https://docs.blockscout.com/for-users/api/rpc-endpoints',
      },
      !config.UI.navigation.hiddenLinks?.eth_rpc_api && {
        text: t('navbar.eth_rpc_api'),
        icon: 'RPC',
        url: ' https://docs.blockscout.com/for-users/api/eth-rpc',
      },
    ].filter(Boolean);

    const otherNavItems: Array<NavItem> | Array<Array<NavItem>> = [
      {
        text: t('navbar.verify_contract'),
        nextRoute: { pathname: '/contract-verification' as const },
        isActive: pathname.startsWith('/contract-verification'),
      },
      config.features.gasTracker.isEnabled && {
        text: t('navbar.gas_tracker'),
        nextRoute: { pathname: '/gas-tracker' as const },
        isActive: pathname.startsWith('/gas-tracker'),
      },
      config.features.publicTagsSubmission.isEnabled && {
        text: t('navbar.submit_public_tag'),
        nextRoute: { pathname: '/public-tags/submit' as const },
        isActive: pathname.startsWith('/public-tags/submit'),
      },
      ...config.UI.navigation.otherLinks,
    ].filter(Boolean);

    const mainNavItems: ReturnType['mainNavItems'] = [
      {
        text: t('navbar.blockchain'),
        icon: 'globe-b',
        isActive: blockchainNavItems.flat().some(item => isInternalItem(item) && item.isActive),
        subItems: blockchainNavItems,
      },
      {
        text: t('navbar.tokens'),
        nextRoute: { pathname: '/tokens' as const },
        icon: 'token',
        isActive: pathname.startsWith('/token'),
      },
      config.features.marketplace.isEnabled ? {
        text: t('navbar.dapps'),
        nextRoute: { pathname: '/apps' as const },
        icon: 'apps',
        isActive: pathname.startsWith('/app'),
      } : null,
      config.features.stats.isEnabled ? {
        text: t('navbar.charts_stats'),
        nextRoute: { pathname: '/stats' as const },
        icon: 'stats',
        isActive: pathname === '/stats',
      } : null,
      apiNavItems.length > 0 && {
        text: t('navbar.api'),
        icon: 'restAPI',
        isActive: apiNavItems.some(item => isInternalItem(item) && item.isActive),
        subItems: apiNavItems,
      },
      {
        text: t('navbar.other'),
        icon: 'gear',
        isActive: otherNavItems.flat().some(item => isInternalItem(item) && item.isActive),
        subItems: otherNavItems,
      },
    ].filter(Boolean);

    const accountNavItems: ReturnType['accountNavItems'] = [
      {
        text: t('navbar.watch_list'),
        nextRoute: { pathname: '/account/watchlist' as const },
        icon: 'watchlist',
        isActive: pathname === '/account/watchlist',
      },
      {
        text: t('navbar.private_tags'),
        nextRoute: { pathname: '/account/tag-address' as const },
        icon: 'privattags',
        isActive: pathname === '/account/tag-address',
      },
      {
        text: t('navbar.api_keys'),
        nextRoute: { pathname: '/account/api-key' as const },
        icon: 'API',
        isActive: pathname === '/account/api-key',
      },
      {
        text: t('navbar.custom_abi'),
        nextRoute: { pathname: '/account/custom-abi' as const },
        icon: 'ABI',
        isActive: pathname === '/account/custom-abi',
      },
      config.features.addressVerification.isEnabled && {
        text: t('navbar.verified_addrs'),
        nextRoute: { pathname: '/account/verified-addresses' as const },
        icon: 'verified',
        isActive: pathname === '/account/verified-addresses',
      },
    ].filter(Boolean);

    const profileItem = {
      text: t('navbar.my_profile'),
      nextRoute: { pathname: '/auth/profile' as const },
      iconComponent: UserAvatar,
      isActive: pathname === '/auth/profile',
    };

    return { mainNavItems, accountNavItems, profileItem };
  }, [ t, pathname ]);
}
