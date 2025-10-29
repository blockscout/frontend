import { useRouter } from 'next/router';
import React from 'react';

import type { NavItemInternal, NavItem, NavGroupItem } from 'types/client/navigation';

import config from 'configs/app';
import { rightLineArrow } from 'toolkit/utils/htmlEntities';

interface ReturnType {
  mainNavItems: Array<NavItem | NavGroupItem>;
  accountNavItems: Array<NavItem>;
}

export function isGroupItem(item: NavItem | NavGroupItem): item is NavGroupItem {
  return 'subItems' in item;
}

export function isInternalItem(item: NavItem): item is NavItemInternal {
  return 'nextRoute' in item;
}

export default function useNavItems(): ReturnType {
  const router = useRouter();
  const pathname = router.pathname;
  const query = router.query;
  const tab = query.tab;

  return React.useMemo(() => {
    let blockchainNavItems: Array<NavItem> | Array<Array<NavItem>> = [];

    const topAccounts: NavItem | null = !config.UI.views.address.hiddenViews?.top_accounts ? {
      text: 'Top accounts',
      nextRoute: { pathname: '/accounts' as const },
      icon: 'top-accounts',
      isActive: pathname === '/accounts',
    } : null;
    const blocks: NavItem | null = {
      text: 'Blocks',
      nextRoute: { pathname: '/blocks' as const },
      icon: 'block',
      isActive: pathname === '/blocks' || pathname === '/block/[height_or_hash]' || pathname === '/chain/[chain-slug]/block/[height_or_hash]',
    };
    const txs: NavItem | null = {
      text: 'Transactions',
      nextRoute: { pathname: '/txs' as const },
      icon: 'transactions',
      isActive:
        // sorry, but this is how it was designed
        (pathname === '/txs' && (!config.features.zetachain.isEnabled || !tab || !tab.includes('cctx'))) ||
        pathname === '/tx/[hash]' ||
        pathname === '/chain/[chain-slug]/tx/[hash]',
    };
    const cctxs: NavItem | null = config.features.zetachain.isEnabled ? {
      text: 'Cross-chain transactions',
      nextRoute: { pathname: '/txs' as const, query: { tab: 'cctx' } },
      icon: 'interop',
      isActive: pathname === '/cc/tx/[hash]' || (pathname === '/txs' && tab?.includes('cctx')),
    } : null;
    const operations: NavItem | null = config.features.tac.isEnabled ? {
      text: 'Operations',
      nextRoute: { pathname: '/operations' as const },
      icon: 'operation',
      isActive: pathname === '/operations' || pathname === '/operation/[id]',
    } : null;
    const internalTxs: NavItem | null = {
      text: 'Internal transactions',
      nextRoute: { pathname: '/internal-txs' as const },
      icon: 'internal_txns',
      isActive: pathname === '/internal-txs',
    };
    const userOps: NavItem | null = config.features.userOps.isEnabled ? {
      text: 'User operations',
      nextRoute: { pathname: '/ops' as const },
      icon: 'user_op',
      isActive: pathname === '/ops' || pathname === '/op/[hash]' || pathname === '/chain/[chain-slug]/op/[hash]',
    } : null;

    const verifiedContracts: NavItem | null =
     {
       text: 'Verified contracts',
       nextRoute: { pathname: '/verified-contracts' as const },
       icon: 'verified',
       isActive: pathname === '/verified-contracts',
     };
    const nameLookup = config.features.nameServices.isEnabled ? {
      text: 'Name services lookup',
      nextRoute: { pathname: '/name-services' as const },
      icon: 'name_services',
      isActive: pathname.startsWith('/name-services'),
    } : null;
    const validators = config.features.validators.isEnabled ? {
      text: 'Validators',
      nextRoute: { pathname: '/validators' as const },
      icon: 'validator',
      isActive: pathname === '/validators' || pathname === '/validators/[id]',
    } : null;
    const rollupDeposits = {
      text: `Deposits (L1${ rightLineArrow }L2)`,
      nextRoute: { pathname: '/deposits' as const },
      icon: 'arrows/south-east',
      isActive: pathname === '/deposits',
    };
    const rollupWithdrawals = {
      text: `Withdrawals (L2${ rightLineArrow }L1)`,
      nextRoute: { pathname: '/withdrawals' as const },
      icon: 'arrows/north-east',
      isActive: pathname === '/withdrawals',
    };
    const rollupTxnBatches = {
      text: 'Txn batches',
      nextRoute: { pathname: '/batches' as const },
      icon: 'txn_batches',
      isActive: pathname === '/batches',
    };
    const rollupOutputRoots = {
      text: 'Output roots',
      nextRoute: { pathname: '/output-roots' as const },
      icon: 'output_roots',
      isActive: pathname === '/output-roots',
    };
    const rollupDisputeGames = config.features.faultProofSystem.isEnabled ? {
      text: 'Dispute games',
      nextRoute: { pathname: '/dispute-games' as const },
      icon: 'games',
      isActive: pathname === '/dispute-games',
    } : null;
    const mudWorlds = config.features.mudFramework.isEnabled ? {
      text: 'MUD worlds',
      nextRoute: { pathname: '/mud-worlds' as const },
      icon: 'MUD_menu',
      isActive: pathname === '/mud-worlds',
    } : null;
    const epochs = config.features.celo.isEnabled ? {
      text: 'Epochs',
      nextRoute: { pathname: '/epochs' as const },
      icon: 'hourglass',
      isActive: pathname.startsWith('/epochs'),
    } : null;

    const rollupFeature = config.features.rollup;

    const rollupInteropMessages = rollupFeature.isEnabled && rollupFeature.interopEnabled ? {
      text: 'Interop messages',
      nextRoute: { pathname: '/interop-messages' as const },
      icon: 'interop',
      isActive: pathname === '/interop-messages',
    } : null;

    if (rollupFeature.isEnabled && (
      rollupFeature.type === 'optimistic' ||
      rollupFeature.type === 'arbitrum' ||
      rollupFeature.type === 'zkEvm' ||
      rollupFeature.type === 'scroll'
    )) {
      blockchainNavItems = [
        [
          txs,
          internalTxs,
          rollupDeposits,
          rollupWithdrawals,
          rollupInteropMessages,
        ].filter(Boolean),
        [
          blocks,
          epochs,
          // currently, transaction batches are not implemented for Celo
          !config.features.celo.isEnabled ? rollupTxnBatches : undefined,
          rollupDisputeGames,
          rollupFeature.outputRootsEnabled ? rollupOutputRoots : undefined,
        ].filter(Boolean),
        [
          userOps,
          topAccounts,
          mudWorlds,
          validators,
          verifiedContracts,
          nameLookup,
        ].filter(Boolean),
      ];
    } else if (rollupFeature.isEnabled && rollupFeature.type === 'shibarium') {
      blockchainNavItems = [
        [
          txs,
          internalTxs,
          rollupDeposits,
          rollupWithdrawals,
        ],
        [
          blocks,
          userOps,
          topAccounts,
          verifiedContracts,
          nameLookup,
        ].filter(Boolean),
      ];
    } else if (rollupFeature.isEnabled && rollupFeature.type === 'zkSync') {
      blockchainNavItems = [
        [
          txs,
          internalTxs,
          userOps,
          blocks,
          rollupTxnBatches,
        ].filter(Boolean),
        [
          topAccounts,
          validators,
          verifiedContracts,
          nameLookup,
        ].filter(Boolean),
      ];
    } else {
      blockchainNavItems = [
        txs,
        operations,
        internalTxs,
        cctxs,
        userOps,
        blocks,
        epochs,
        topAccounts,
        validators,
        verifiedContracts,
        nameLookup,
        config.features.beaconChain.isEnabled && {
          text: 'Deposits',
          nextRoute: { pathname: '/deposits' as const },
          icon: 'arrows/south-east',
          isActive: pathname === '/deposits',
        },
        config.features.beaconChain.isEnabled && {
          text: 'Withdrawals',
          nextRoute: { pathname: '/withdrawals' as const },
          icon: 'arrows/north-east',
          isActive: pathname === '/withdrawals',
        },
      ].filter(Boolean);
    }

    const tokensNavItems = [
      {
        text: 'Tokens',
        nextRoute: { pathname: '/tokens' as const },
        icon: 'token',
        isActive: pathname === '/tokens' || pathname.startsWith('/token/'),
      },
      {
        text: 'Token transfers',
        nextRoute: { pathname: '/token-transfers' as const },
        icon: 'token-transfers',
        isActive: pathname === '/token-transfers',
      },
      config.features.pools.isEnabled && {
        text: 'DEX tracker',
        nextRoute: { pathname: '/pools' as const },
        icon: 'dex-tracker',
        isActive: pathname === '/pools' || pathname.startsWith('/pool/'),
      },
    ].filter(Boolean);

    const statsNavItem = (() => {
      const uptimeItem = {
        text: 'Uptime',
        nextRoute: { pathname: '/uptime' as const },
        icon: 'refresh_menu',
        isActive: pathname.startsWith('/uptime'),
      };

      if (config.features.stats.isEnabled && config.features.megaEth.isEnabled) {
        return {
          text: 'Charts & stats',
          icon: 'stats',
          isActive: pathname.startsWith('/stats') || pathname.startsWith('/uptime'),
          subItems: [
            {
              text: `${ config.chain.name } stats`,
              nextRoute: { pathname: '/stats' as const },
              icon: 'graph',
              isActive: pathname.startsWith('/stats/'),
            },
            uptimeItem,
          ],
        };
      }

      if (!config.features.stats.isEnabled) {
        if (config.features.megaEth.isEnabled) {
          return uptimeItem;
        }
        return null;
      }

      return {
        text: 'Charts & stats',
        nextRoute: { pathname: '/stats' as const },
        icon: 'stats',
        isActive: pathname.startsWith('/stats'),
      };
    })();

    const apiNavItem: NavItem | null = config.features.apiDocs.isEnabled ? {
      text: 'API',
      nextRoute: { pathname: '/api-docs' as const },
      icon: 'restAPI',
      isActive: pathname.startsWith('/api-docs'),
    } : null;

    const otherNavItems: Array<NavItem> | Array<Array<NavItem>> = [
      config.features.opSuperchain.isEnabled ? {
        text: 'Verify contract',
        // TODO @tom2drum adjust URL to Vera
        url: 'https://vera.blockscout.com',
      } : {
        text: 'Verify contract',
        nextRoute: { pathname: '/contract-verification' as const },
        isActive: pathname.startsWith('/contract-verification'),
      },
      config.features.gasTracker.isEnabled && {
        text: 'Gas tracker',
        nextRoute: { pathname: '/gas-tracker' as const },
        isActive: pathname.startsWith('/gas-tracker'),
      },
      config.features.publicTagsSubmission.isEnabled && {
        text: 'Submit public tag',
        nextRoute: { pathname: '/public-tags/submit' as const },
        isActive: pathname.startsWith('/public-tags/submit'),
      },
      rollupFeature.isEnabled && rollupFeature.type === 'arbitrum' && {
        text: 'Txn withdrawals',
        nextRoute: { pathname: '/txn-withdrawals' as const },
        isActive: pathname.startsWith('/txn-withdrawals'),
      },
      ...config.UI.navigation.otherLinks,
    ].filter(Boolean);

    const mainNavItems: ReturnType['mainNavItems'] = [
      {
        text: 'Blockchain',
        icon: 'globe-b',
        isActive: blockchainNavItems.flat().some(item => isInternalItem(item) && item.isActive),
        subItems: blockchainNavItems,
      },
      {
        text: 'Tokens',
        icon: 'token',
        isActive: tokensNavItems.flat().some(item => isInternalItem(item) && item.isActive),
        subItems: tokensNavItems,
      },
      config.features.marketplace.isEnabled ? {
        text: 'DApps',
        nextRoute: { pathname: '/apps' as const },
        icon: 'apps',
        isActive: pathname.startsWith('/app') || pathname.startsWith('/essential-dapps'),
      } : null,
      statsNavItem,
      apiNavItem,
      {
        text: 'Other',
        icon: 'gear',
        isActive: otherNavItems.flat().some(item => isInternalItem(item) && item.isActive),
        subItems: otherNavItems,
      },
    ].filter(Boolean);

    const accountNavItems: ReturnType['accountNavItems'] = [
      {
        text: 'Watch list',
        nextRoute: { pathname: '/account/watchlist' as const },
        icon: 'watchlist',
        isActive: pathname === '/account/watchlist',
      },
      {
        text: 'Private tags',
        nextRoute: { pathname: '/account/tag-address' as const },
        icon: 'privattags',
        isActive: pathname === '/account/tag-address',
      },
      {
        text: 'API keys',
        nextRoute: { pathname: '/account/api-key' as const },
        icon: 'API',
        isActive: pathname === '/account/api-key',
      },
      {
        text: 'Custom ABI',
        nextRoute: { pathname: '/account/custom-abi' as const },
        icon: 'ABI',
        isActive: pathname === '/account/custom-abi',
      },
      config.features.addressVerification.isEnabled && {
        text: 'Verified addrs',
        nextRoute: { pathname: '/account/verified-addresses' as const },
        icon: 'verified',
        isActive: pathname === '/account/verified-addresses',
      },
    ].filter(Boolean);

    return { mainNavItems, accountNavItems };
  }, [ pathname, tab ]);
}
