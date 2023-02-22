import { useRouter } from 'next/router';
import type { Route } from 'nextjs-routes';
import React from 'react';

import appConfig from 'configs/app/config';
import abiIcon from 'icons/ABI.svg';
import apiKeysIcon from 'icons/API.svg';
import appsIcon from 'icons/apps.svg';
import blocksIcon from 'icons/block.svg';
import gearIcon from 'icons/gear.svg';
import globeIcon from 'icons/globe-b.svg';
import privateTagIcon from 'icons/privattags.svg';
import profileIcon from 'icons/profile.svg';
import publicTagIcon from 'icons/publictags.svg';
import statsIcon from 'icons/stats.svg';
import tokensIcon from 'icons/token.svg';
import topAccountsIcon from 'icons/top-accounts.svg';
import transactionsIcon from 'icons/transactions.svg';
// import verifiedIcon from 'icons/verified.svg';
import watchlistIcon from 'icons/watchlist.svg';
import notEmpty from 'lib/notEmpty';

export interface NavItem {
  text: string;
  nextRoute: Route;
  icon: React.FunctionComponent<React.SVGAttributes<SVGElement>>;
  isActive?: boolean;
  isNewUi?: boolean;
}

export interface NavGroupItem extends Omit<NavItem, 'nextRoute'> {
  subItems: Array<NavItem>;
}

interface ReturnType {
  mainNavItems: Array<NavItem | NavGroupItem>;
  accountNavItems: Array<NavItem>;
  profileItem: NavItem;
}

export function isGroupItem(item: NavItem | NavGroupItem): item is NavGroupItem {
  return 'subItems' in item;
}

export default function useNavItems(): ReturnType {
  const isMarketplaceFilled = appConfig.marketplaceAppList.length > 0 && appConfig.network.rpcUrl;
  const hasAPIDocs = appConfig.apiDoc.specUrl;

  const router = useRouter();
  const pathname = router.pathname;

  return React.useMemo(() => {
    const blockchainNavItems: Array<NavItem> = [
      { text: 'Top accounts', nextRoute: { pathname: '/accounts' as const }, icon: topAccountsIcon, isActive: pathname === '/accounts', isNewUi: true },
      { text: 'Blocks', nextRoute: { pathname: '/blocks' as const }, icon: blocksIcon, isActive: pathname.startsWith('/block'), isNewUi: true },
      { text: 'Transactions', nextRoute: { pathname: '/txs' as const }, icon: transactionsIcon, isActive: pathname.startsWith('/tx'), isNewUi: true },
      // eslint-disable-next-line max-len
      // { text: 'Verified contracts', nextRoute: { pathname: '/verified_contracts' as const }, icon: verifiedIcon, isActive: pathname === '/verified_contracts', isNewUi: false },
    ];

    const otherNavItems: Array<NavItem> = [
      hasAPIDocs ? {
        text: 'API documentation',
        nextRoute: { pathname: '/api-docs' as const },
        // FIXME: need icon for this item
        icon: topAccountsIcon,
        isActive: pathname === '/api-docs',
        isNewUi: true,
      } : null,
    ].filter(notEmpty);

    const mainNavItems = [
      {
        text: 'Blockchain',
        icon: globeIcon,
        isActive: blockchainNavItems.some(item => item.isActive),
        isNewUi: true,
        subItems: blockchainNavItems,
      },
      { text: 'Tokens', nextRoute: { pathname: '/tokens' as const }, icon: tokensIcon, isActive: pathname.startsWith('/token'), isNewUi: true },
      isMarketplaceFilled ?
        { text: 'Apps', nextRoute: { pathname: '/apps' as const }, icon: appsIcon, isActive: pathname.startsWith('/app'), isNewUi: true } : null,
      { text: 'Charts & stats', nextRoute: { pathname: '/stats' as const }, icon: statsIcon, isActive: pathname === '/stats', isNewUi: true },
      // there should be custom site sections like Stats, Faucet, More, etc but never an 'other'
      // examples https://explorer-edgenet.polygon.technology/ and https://explorer.celo.org/
      // at this stage custom menu items is under development, we will implement it later
      otherNavItems.length > 0 ?
        { text: 'Other', icon: gearIcon, isActive: otherNavItems.some(item => item.isActive), subItems: otherNavItems } : null,
    ].filter(notEmpty);

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
        icon: publicTagIcon, isActive: pathname === '/account/public_tags_request', isNewUi: true,
      },
      { text: 'API keys', nextRoute: { pathname: '/account/api_key' as const }, icon: apiKeysIcon, isActive: pathname === '/account/api_key', isNewUi: true },
      {
        text: 'Custom ABI',
        nextRoute: { pathname: '/account/custom_abi' as const },
        icon: abiIcon,
        isActive: pathname === '/account/custom_abi',
        isNewUi: true,
      },
    ];

    const profileItem = {
      text: 'My profile', nextRoute: { pathname: '/auth/profile' as const }, icon: profileIcon, isActive: pathname === '/auth/profile', isNewUi: true };

    return { mainNavItems, accountNavItems, profileItem };
  }, [ hasAPIDocs, isMarketplaceFilled, pathname ]);
}
