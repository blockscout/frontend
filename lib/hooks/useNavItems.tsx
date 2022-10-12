import React, { useMemo } from 'react';

import marketplaceApps from 'data/marketplaceApps.json';
import abiIcon from 'icons/ABI.svg';
import apiKeysIcon from 'icons/API.svg';
import appsIcon from 'icons/apps.svg';
import blocksIcon from 'icons/block.svg';
// import gearIcon from 'icons/gear.svg';
import privateTagIcon from 'icons/privattags.svg';
import profileIcon from 'icons/profile.svg';
import publicTagIcon from 'icons/publictags.svg';
import tokensIcon from 'icons/token.svg';
import transactionsIcon from 'icons/transactions.svg';
import watchlistIcon from 'icons/watchlist.svg';
import useCurrentRoute from 'lib/link/useCurrentRoute';
import useLink from 'lib/link/useLink';
import notEmpty from 'lib/notEmpty';

import useNetwork from './useNetwork';

export default function useNavItems() {
  const selectedNetwork = useNetwork();

  const isMarketplaceFilled = useMemo(() =>
    marketplaceApps.filter(item => item.chainIds.includes(selectedNetwork?.chainId)),
  [ selectedNetwork?.chainId ])
    .length > 0;

  const link = useLink();
  const currentRoute = useCurrentRoute()();

  return React.useMemo(() => {
    const mainNavItems = [
      { text: 'Blocks', url: link('blocks'), icon: blocksIcon, isActive: currentRoute.startsWith('block') },
      { text: 'Transactions', url: link('txs'), icon: transactionsIcon, isActive: currentRoute.startsWith('tx') },
      { text: 'Tokens', url: link('tokens'), icon: tokensIcon, isActive: currentRoute === 'tokens' },
      isMarketplaceFilled ?
        { text: 'Apps', url: link('apps'), icon: appsIcon, isActive: currentRoute === 'apps' } : null,
      // there should be custom site sections like Stats, Faucet, More, etc but never an 'other'
      // examples https://explorer-edgenet.polygon.technology/ and https://explorer.celo.org/
      // at this stage custom menu items is under development, we will implement it later
      // { text: 'Other', url: link('other'), icon: gearIcon, isActive: currentRoute === 'other' },
    ].filter(notEmpty);

    const accountNavItems = [
      { text: 'Watchlist', url: link('watchlist'), icon: watchlistIcon, isActive: currentRoute === 'watchlist' },
      { text: 'Private tags', url: link('private_tags'), icon: privateTagIcon, isActive: currentRoute.startsWith('private_tags') },
      { text: 'Public tags', url: link('public_tags'), icon: publicTagIcon, isActive: currentRoute === 'public_tags' },
      { text: 'API keys', url: link('api_keys'), icon: apiKeysIcon, isActive: currentRoute === 'api_keys' },
      { text: 'Custom ABI', url: link('custom_abi'), icon: abiIcon, isActive: currentRoute === 'custom_abi' },
    ];

    const profileItem = { text: 'My profile', url: link('profile'), icon: profileIcon, isActive: currentRoute === 'profile' };

    return { mainNavItems, accountNavItems, profileItem };
  }, [ isMarketplaceFilled, link, currentRoute ]);
}
