import { useRouter } from 'next/router';
import type { Route } from 'nextjs-routes';
import React from 'react';

import appConfig from 'configs/app/config';
import abiIcon from 'icons/ABI.svg';
import apiKeysIcon from 'icons/API.svg';
import appsIcon from 'icons/apps.svg';
import withdrawalsIcon from 'icons/arrows/north-east.svg';
import depositsIcon from 'icons/arrows/south-east.svg';
import blocksIcon from 'icons/block.svg';
import gearIcon from 'icons/gear.svg';
import globeIcon from 'icons/globe-b.svg';
import graphQLIcon from 'icons/graphQL.svg';
import outputRootsIcon from 'icons/output_roots.svg';
import privateTagIcon from 'icons/privattags.svg';
import profileIcon from 'icons/profile.svg';
import publicTagIcon from 'icons/publictags.svg';
import apiDocsIcon from 'icons/restAPI.svg';
import rpcIcon from 'icons/RPC.svg';
import statsIcon from 'icons/stats.svg';
import tokensIcon from 'icons/token.svg';
import topAccountsIcon from 'icons/top-accounts.svg';
import transactionsIcon from 'icons/transactions.svg';
import txnBatchIcon from 'icons/txn_batches.svg';
import verifiedIcon from 'icons/verified.svg';
import watchlistIcon from 'icons/watchlist.svg';
import { rightLineArrow } from 'lib/html-entities';

type NavItemCommon = {
  text: string;
  icon: React.FunctionComponent<React.SVGAttributes<SVGElement>>;
}

type NavItemInternal = NavItemCommon & {
  nextRoute: Route;
  isActive?: boolean;
  isNewUi?: boolean;
}

type NavItemExternal = NavItemCommon & {
  url: string;
}

export type NavItem = NavItemInternal | NavItemExternal

export type NavGroupItem = NavItemCommon & {
  isActive?: boolean;
  subItems: Array<NavItem> | Array<Array<NavItem>>;
}

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
  const isMarketplaceFilled = appConfig.marketplaceAppList.length > 0 && appConfig.network.rpcUrl;
  const hasAPIDocs = appConfig.apiDoc.specUrl;

  const router = useRouter();
  const pathname = router.pathname;

  return React.useMemo(() => {
    let blockchainNavItems: Array<NavItem> | Array<Array<NavItem>> = [];

    const topAccounts = {
      text: 'Top accounts',
      nextRoute: { pathname: '/accounts' as const },
      icon: topAccountsIcon,
      isActive: pathname === '/accounts',
      isNewUi: true,
    };
    const blocks = {
      text: 'Blocks',
      nextRoute: { pathname: '/blocks' as const },
      icon: blocksIcon,
      isActive: pathname === '/blocks' || pathname === '/block/[height]',
      isNewUi: true,
    };
    const txs = {
      text: 'Transactions',
      nextRoute: { pathname: '/txs' as const },
      icon: transactionsIcon,
      isActive: pathname === '/txs' || pathname === '/tx/[hash]',
      isNewUi: true,
    };
    const verifiedContracts =
    // eslint-disable-next-line max-len
     { text: 'Verified contracts', nextRoute: { pathname: '/verified-contracts' as const }, icon: verifiedIcon, isActive: pathname === '/verified-contracts', isNewUi: true };

    if (appConfig.L2.isL2Network) {
      blockchainNavItems = [
        [
          txs,
          // eslint-disable-next-line max-len
          { text: `Deposits (L1${ rightLineArrow }L2)`, nextRoute: { pathname: '/deposits' as const }, icon: depositsIcon, isActive: pathname === '/deposits', isNewUi: true },
          // eslint-disable-next-line max-len
          { text: `Withdrawals (L2${ rightLineArrow }L1)`, nextRoute: { pathname: '/withdrawals' as const }, icon: withdrawalsIcon, isActive: pathname === '/withdrawals', isNewUi: true },
        ],
        [
          blocks,
          // eslint-disable-next-line max-len
          { text: 'Txn batches', nextRoute: { pathname: '/txn-batches' as const }, icon: txnBatchIcon, isActive: pathname === '/txn-batches', isNewUi: true },
          // eslint-disable-next-line max-len
          { text: 'Output roots', nextRoute: { pathname: '/output-roots' as const }, icon: outputRootsIcon, isActive: pathname === '/output-roots', isNewUi: true },
        ],
        [
          topAccounts,
          verifiedContracts,
        ],
      ];
    } else {
      blockchainNavItems = [
        txs,
        blocks,
        topAccounts,
        verifiedContracts,
      ];
    }

    const otherNavItems: Array<NavItem> = [
      hasAPIDocs ? {
        text: 'REST API',
        nextRoute: { pathname: '/api-docs' as const },
        icon: apiDocsIcon,
        isActive: pathname === '/api-docs',
        isNewUi: true,
      } : null,
      {
        text: 'GraphQL',
        nextRoute: { pathname: '/graphiql' as const },
        icon: graphQLIcon,
        isActive: pathname === '/graphiql',
        isNewUi: true,
      },
      {
        text: 'RPC API',
        icon: rpcIcon,
        url: 'https://docs.blockscout.com/for-users/api/rpc-endpoints',
      },
      {
        text: 'Eth RPC API',
        icon: rpcIcon,
        url: ' https://docs.blockscout.com/for-users/api/eth-rpc',
      },
    ].filter(Boolean);

    const mainNavItems = [
      {
        text: 'Blockchain',
        icon: globeIcon,
        isActive: blockchainNavItems.flat().some(item => isInternalItem(item) && item.isActive),
        isNewUi: true,
        subItems: blockchainNavItems,
      },
      {
        text: 'Tokens',
        nextRoute: { pathname: '/tokens' as const },
        icon: tokensIcon,
        isActive: pathname.startsWith('/token'),
        isNewUi: true,
      },
      isMarketplaceFilled ? {
        text: 'Apps',
        nextRoute: { pathname: '/apps' as const },
        icon: appsIcon,
        isActive: pathname.startsWith('/app'),
        isNewUi: true,
      } : null,
      { text: 'Charts & stats', nextRoute: { pathname: '/stats' as const }, icon: statsIcon, isActive: pathname === '/stats', isNewUi: true },
      // there should be custom site sections like Stats, Faucet, More, etc but never an 'other'
      // examples https://explorer-edgenet.polygon.technology/ and https://explorer.celo.org/
      // at this stage custom menu items is under development, we will implement it later
      otherNavItems.length > 0 ? {
        text: 'Other',
        icon: gearIcon,
        isActive: otherNavItems.some(item => isInternalItem(item) && item.isActive),
        subItems: otherNavItems,
      } : null,
    ].filter(Boolean) as Array<NavItem | NavGroupItem>;

    const accountNavItems = [
      {
        text: 'Watchlist',
        nextRoute: { pathname: '/account/watchlist' as const },
        icon: watchlistIcon,
        isActive: pathname === '/account/watchlist',
        isNewUi: true,
      },
      {
        text: 'Private tags',
        nextRoute: { pathname: '/account/tag_address' as const },
        icon: privateTagIcon,
        isActive: pathname === '/account/tag_address',
        isNewUi: true,
      },
      {
        text: 'Public tags',
        nextRoute: { pathname: '/account/public_tags_request' as const },
        icon: publicTagIcon, isActive: pathname === '/account/public_tags_request',
        isNewUi: true,
      },
      {
        text: 'API keys',
        nextRoute: { pathname: '/account/api_key' as const },
        icon: apiKeysIcon, isActive: pathname === '/account/api_key',
        isNewUi: true,
      },
      {
        text: 'Custom ABI',
        nextRoute: { pathname: '/account/custom_abi' as const },
        icon: abiIcon,
        isActive: pathname === '/account/custom_abi',
        isNewUi: true,
      },
      appConfig.contractInfoApi.endpoint && appConfig.adminServiceApi.endpoint && {
        text: 'Verified addresses',
        nextRoute: { pathname: '/account/verified_addresses' as const },
        icon: verifiedIcon,
        isActive: pathname === '/account/verified_addresses',
        isNewUi: true,
      },
    ].filter(Boolean);

    const profileItem = {
      text: 'My profile',
      nextRoute: { pathname: '/auth/profile' as const },
      icon: profileIcon,
      isActive: pathname === '/auth/profile',
      isNewUi: true,
    };

    return { mainNavItems, accountNavItems, profileItem };
  }, [ hasAPIDocs, isMarketplaceFilled, pathname ]);
}
