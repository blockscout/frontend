import React from 'react';

import appConfig from 'configs/app/config';
import abiIcon from 'icons/ABI.svg';
import apiKeysIcon from 'icons/API.svg';
import appsIcon from 'icons/apps.svg';
import blocksIcon from 'icons/block.svg';
// import gearIcon from 'icons/gear.svg';
import privateTagIcon from 'icons/privattags.svg';
import profileIcon from 'icons/profile.svg';
import publicTagIcon from 'icons/publictags.svg';
import statsIcon from 'icons/stats.svg';
import tokensIcon from 'icons/token.svg';
import transactionsIcon from 'icons/transactions.svg';
import walletIcon from 'icons/wallet.svg';
import watchlistIcon from 'icons/watchlist.svg';
import link from 'lib/link/link';
import useCurrentRoute from 'lib/link/useCurrentRoute';
import notEmpty from 'lib/notEmpty';

export default function useNavItems() {
  const isMarketplaceFilled = appConfig.marketplaceAppList.length > 0;

  const currentRoute = useCurrentRoute()();

  return React.useMemo(() => {
    const mainNavItems = [
      { text: 'Blocks', url: link('blocks'), icon: blocksIcon, isActive: currentRoute.startsWith('block'), isNewUi: true },
      { text: 'Transactions', url: link('txs'), icon: transactionsIcon, isActive: currentRoute.startsWith('tx'), isNewUi: true },
      { text: 'Tokens', url: link('tokens'), icon: tokensIcon, isActive: currentRoute.startsWith('token'), isNewUi: true },
      { text: 'Accounts', url: link('accounts'), icon: walletIcon, isActive: currentRoute === 'accounts', isNewUi: true },
      isMarketplaceFilled ?
        { text: 'Apps', url: link('apps'), icon: appsIcon, isActive: currentRoute.startsWith('app'), isNewUi: true } : null,
      { text: 'Charts & stats', url: link('stats'), icon: statsIcon, isActive: currentRoute === 'stats', isNewUi: true },
      // there should be custom site sections like Stats, Faucet, More, etc but never an 'other'
      // examples https://explorer-edgenet.polygon.technology/ and https://explorer.celo.org/
      // at this stage custom menu items is under development, we will implement it later
      // { text: 'Other', url: link('other'), icon: gearIcon, isActive: currentRoute === 'other' },
    ].filter(notEmpty);

    const accountNavItems = [
      { text: 'Watchlist', url: link('watchlist'), icon: watchlistIcon, isActive: currentRoute === 'watchlist', isNewUi: true },
      { text: 'Private tags', url: link('private_tags'), icon: privateTagIcon, isActive: currentRoute.startsWith('private_tags'), isNewUi: true },
      { text: 'Public tags', url: link('public_tags'), icon: publicTagIcon, isActive: currentRoute === 'public_tags', isNewUi: true },
      { text: 'API keys', url: link('api_keys'), icon: apiKeysIcon, isActive: currentRoute === 'api_keys', isNewUi: true },
      { text: 'Custom ABI', url: link('custom_abi'), icon: abiIcon, isActive: currentRoute === 'custom_abi', isNewUi: true },
    ];

    const profileItem = { text: 'My profile', url: link('profile'), icon: profileIcon, isActive: currentRoute === 'profile', isNewUi: true };

    return { mainNavItems, accountNavItems, profileItem };
  }, [ isMarketplaceFilled, currentRoute ]);
}
